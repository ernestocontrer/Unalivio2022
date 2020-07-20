import * as functions from 'firebase-functions';
import Stripe from 'stripe';

import {verifyApp} from './orders/verify.app';
import {validate} from './orders/validate'
import sendmail from './sendmail';


const currentRate = async (db: FirebaseFirestore.Firestore) => {
  const ratesQuery = await db.collection('rates').where('pair', '==', db.doc('pairs/VESMXN')).orderBy('time', 'desc').limit(1).get();

  const rate = ratesQuery.docs[0].data()
  return rate;
} 

const validAmounts = async (db: FirebaseFirestore.Firestore) => (await db.collection('amounts').get()).docs.map(
  (doc):number => doc.data().amount
)

const validProducts = async (db: FirebaseFirestore.Firestore) => (await db.collection('products').get()).docs.map(
  (doc):number => doc.data().value
)

export const generate = (
  db: FirebaseFirestore.Firestore, 
  stripe: Stripe
) => functions.https.onCall(async (order, context) => {
  const {product, amount, from, to} = order;

  if (!product || !amount || !from || !to) {
    const up = new functions.https.HttpsError(
      'invalid-argument', 'Por favor rellena todos los campos correctamente');
    throw up;
  }

  const amounts = await validAmounts(db);
  const rate = await currentRate(db);
  const products = await validProducts(db);


  try {
    
    await validate.email('from', from, 'es');
    validate.amount('amount', amount, 'es', amounts, rate.price);
    validate.phone('phone', to, 'es');
    validate.product('product', product, 'es', products)
  } catch(error) {
    const up = new functions.https.HttpsError(
      'invalid-argument', error.message);
    throw up;
  }
  
  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.ceil((amount / rate.price) * 1e2),
      currency: 'mxn',
    });
  
    const timestamp = new Date();
    await db.collection('orders').add({
      product: db.doc(`products/${product}`),
      amount,
      from,
      to,
      method: db.doc('methods/card'),
      intent: intent.id,
      created: timestamp
    });
    
    return intent;
  } catch (err) {
    console.error(err);
    const up = new functions.https.HttpsError('internal', 'Imposible crear intento de pago');
    throw up;
  }
});

export const verify = (
  db: FirebaseFirestore.Firestore,
  stripe: Stripe
) => functions.https.onRequest(verifyApp(stripe, {
  'payment_intent.succeeded': async (intent: Stripe.PaymentIntent) => {
    const timestamp = new Date();
    const snap = await db.collection('orders').where('intent', '==', intent.id).get();

    snap.forEach(doc => (doc.ref.update({
      succeeded: timestamp
    })));

    console.log("Succeeded:", intent.id);
  },
  'payment_intent.payment_failed': async (intent: Stripe.PaymentIntent) => {
    const timestamp = new Date();
    const message = intent.last_payment_error && intent.last_payment_error.message;
    const snap = await db.collection('orders').where('intent', '==', intent.id).get();

    snap.forEach(doc => (doc.ref.update({
      failed: timestamp,
      reason: message
    })));

    console.error('Failed:', intent.id, message);
  }
}));

export const notifyCreation = (
  db: FirebaseFirestore.Firestore
) => functions.
  firestore.
  document('orders/{orderId}').
  onCreate(async (snap, context) => {
    const order = snap.data();

    if (!order) {
      console.error('Orden vacía')
      return
    }

    const rate = await currentRate(db);

    if (!rate) {
      console.error('Tasa vacía')
      return
    }

    const price = order.amount * rate.price

    await snap.ref.update({price});

    const mail = {
      from: functions.config().gmail.user,
      to: order.from,
      bcc: functions.config().unalivio.bcc,
      subject: 'Gracias por usar Alíviame! ',
      html: `<div>
        <h1>Muy bien!</h1>
        <br />
        <p>Hemos recibido tu pago:</p>
        <ul>
          <li>tel: ${order.to}</li>
          <li>mxn: ${order.amount}</li>
        </ul>
        <br />
        <p>Que a la tasa ${rate.price} (al ${rate.time}) recargas:</p>
        <ul>
          <li>ves: ${price}</li>
        </ul>
        <br />
        <p>Y te avisaremos cuando esté lista.</p>
      </div>`
    }

    await sendmail(mail)
  });

export const notifyUpdate = () => functions.firestore.document('orders/{orderId}').onUpdate(async (change, context) => {
  const order = change.after.data();

  if (!order) {
    return
    //const up = new Error()
  }

  if (order.succeeded) {
    const mail = {
      from: functions.config().gmail.user,
      to: order.from,
      bcc: functions.config().unalivio.bcc,
      subject: `Tu recarga de ${order.amount} a ${order.to} fué exitosa!`,
      html: `<div>
        <h1>Muy bien!</h1>
        <br />
        <p>Confirmamos la recarga (al ${order.succeeded}) por:</p>
        <ul>
          <li>tel: ${order.to}</li>
          <li>ves: ${order.price}</li>
        </ul>
        <br />
        <h6>Si algo salió mal por favor dínoslo.</h6>
        <br />
        <p>Gracias y cómpartelo para que más personas puedan recibir Un Alivio.</p>
      </div>`
    }

    await sendmail(mail)
  }
});

