import * as functions from 'firebase-functions';
import Stripe from 'stripe';

import {verifyApp} from './orders/verify.app';
import {validate} from './orders/validate'
import sendmail from './sendmail';


const currentRate = async (db: FirebaseFirestore.Firestore) => {
  const ratesQuery = await db.collection('rates').where('pair', '==', db.doc('pairs/VESMXN')).orderBy('time', 'desc').limit(1).get();

  const rate = ratesQuery.docs[0]//.data()
  return rate;
} 

const validAmounts = async (db: FirebaseFirestore.Firestore) => (await db.collection('amounts').get()).docs.map(
  (doc):number => doc.data().value
)

const validProducts = async (db: FirebaseFirestore.Firestore) => (await db.collection('products').get()).docs.map(
  (doc):string => doc.id
)

const computePrice = (amount: number, rate: number):number => (Math.ceil((((amount / rate) + Number.EPSILON) * 100)) / 100) 

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
    validate.amount('amount', amount, 'es', amounts, rate.data().price);
    validate.phone('phone', to, 'es');
    validate.product('product', product, 'es', products)
  } catch(error) {
    const up = new functions.https.HttpsError(
      'invalid-argument', error.message);
    throw up;
  }
  
  try {
    const price = computePrice(amount, rate.data().price);
    const intent = await stripe.paymentIntents.create({ 
      amount: Math.ceil(price * 100),
      currency: 'mxn',
    });
  
    const timestamp = new Date();
    await db.collection('orders').add({
      product: db.doc(`products/${product}`),
      amount,
      from,
      to,
      price,
      rate: rate.ref,
      method: db.doc('methods/card'),
      intent: intent.id,
      created: timestamp
    });

    console.log('Created:', intent.id)
    return intent;
  } catch (err) {
    console.error(err);
    const up = new functions.https.HttpsError('internal', 'No pudimos procesar el pago:'+ err.message);
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

    const rate = (await order.rate.get()).data();

    if (!rate) {
      console.error('Tasa vacía')
      return
    }

    const mail = {
      from: functions.config().gmail.user,
      to: order.from,
      bcc: functions.config().unalivio.bcc,
      subject: `Unalivio para ${order.to} de ${order.amount} va en camino! 🙌`,
      html: `<div>
        <h1>Muy bien!</h1>
        <br />
        <p>Hemos recibido tu órden #${context.params.orderId}:</p>
        <ul>
          <li>Teléfono: ${order.to}</li>
          <li>Precio: ${order.price}</li>
        </ul>
        <br />
        <p>Que a la tasa ${rate.price} VES/MXN (en ${rate.time.toDate().toLocaleString()}) recargas:</p>
        <ul>
          <li>Recarga: ${order.amount} Bs. S</li>
        </ul>
        <br />
        <p>Y te avisaremos en cuánto el pago quede listo. 💪</p>
      </div>`
    }

    await sendmail(mail)
  });

export const notifyUpdate = () => functions.firestore.document('orders/{orderId}').onUpdate(async (change, context) => {
  const order = change.after.data();

  if (!order) return;

  if (order.settled) {
    const mail = {
      from: functions.config().gmail.user,
      to: order.from,
      bcc: functions.config().unalivio.bcc,
      subject: `Haz aliviado ${order.amount} a ${order.to}! 🥳`,
      html: `<div>
        <h1>Muy bien!</h1>
        <br />
        <p>Confirmamos la recarga (en ${order.settled.toDate().toLocaleString()}) de tu orden #${context.params.orderId}:</p>
        <ul>
          <li>Teléfono: ${order.to}</li>
          <li>Recarga: ${order.amount} Bs. S</li>
          <li>Precio: ${order.price} MXN</li>
        </ul>
        <br />
        <h6>Si algo salió mal por favor dínoslo.</h6>
        <br />
        <p>Gracias y cómpartelo para que más personas puedan recibir Unalivio! 💛💙💖</p>
      </div>`
    }

    await sendmail(mail);
    return;
  }

  if (order.succeeded) {
    const mail = {
      from: functions.config().gmail.user,
      to: order.from,
      bcc: functions.config().unalivio.bcc,
      subject: `Tu alivio por ${order.price} MXN fué pagado! 👏`,
      html: `<div>
        <h1>Muy bien!</h1>
        <br />
        <p>Confirmamos el pago (en ${order.succeeded.toDate().toLocaleString()}) de tu orden #${context.params.orderId}:</p>
        <ul>
          <li>Teléfono: ${order.to}</li>
          <li>Recarga: ${order.amount} Bs. S</li>
          <li>Precio: ${order.price} MXN</li>
        </ul>
        <br />
        <h6>Si algo salió mal por favor dínoslo.</h6>
        <br />
        <p>Muy pronto llegará unalivio! ✨</p>
      </div>`
    }

    await sendmail(mail);
    return;
  }
});

