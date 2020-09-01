import * as functions from 'firebase-functions';
import Stripe from 'stripe';

import {verifyApp} from './orders/verify.app';
import {validate} from './orders/validate'
import sendmail from './sendmail';

const locale = 'es-MX';
const options = {
  timeZone: 'America/Mexico_City'
}

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
      subject: `Solicitaste UnAlivio a ${order.to} por ${order.amount} Bs. S  🙌`,
      html: `<div>
        <h1>¡Recibimos tu solicitud!</h1>
        <br />
        <p>Hemos recibido tu orden con código #${context.params.orderId}:</p>
        <ul>
          <li>Teléfono: ${order.to}</li>
          <li>Recarga: ${order.amount} Bs. S</li>
          <li>Cargo a tu tarjeta: ${order.price} MXN</li>
          <li>Fecha y hora de recepción: ${order.created.toDate().toLocaleString(locale, options)}</li>
        </ul>
        <br />
        <p>El siguiente paso es que tu orden se cobrará, y le haremos llegar la recarga a tu ser querido! Relájate y nosotros te mantenemos informados con dos correos más. 😌</p>
        <h6>Si algo salió mal por favor dínoslo a <a href="mailto:contacto@unalivio.com">contacto@unalivio.com</a> o respondiendo a éste correo, estamos para servirte.</h6>
      </div>`
    }

    await sendmail(mail)
  });

export const notifyUpdate = () => functions.firestore.document('orders/{orderId}').onUpdate(async (change, context) => {
  const order = change.after.data();

  if (!order) return;


  if (order.succeeded) {
    if (order.settled && order.reference && order.provider) {
      const mail = {
        from: functions.config().gmail.user,
        to: order.from,
        bcc: functions.config().unalivio.bcc,
        subject: `Has enviado UnAlivio a ${order.to} por ${order.amount} Bs. S. 🥳`,
        html: `<div>
          <h1>¡Tu Alivio ya fué Recargado!</h1>
          <br />
          <p>Confirmamos haber completado la recarga de tu orden con código #${context.params.orderId}:</p>
          <ul>
            <li>Teléfono: ${order.to}</li>
            <li>Recarga: ${order.amount} Bs. S</li>
            <li>Cargo a tu tarjeta: ${order.price} MXN</li>
            <li>Fecha y hora de recepción: ${order.created.toDate().toLocaleString(locale, options)}</li>
            <li>Fecha y hora de recepción: ${order.succeeded.toDate().toLocaleString(locale, options)}</li>
            <li>Fecha y hora de recepción: ${order.settled.toDate().toLocaleString(locale, options)}</li>
          </ul>
          <br />
          <p>Tu ser querido ha sido aliviado, llámalo que ya tiene saldo! </p><br />
          <p>Gracias y cuéntanos que opinas en Instagram <a target="_blank" href="https://instagram.com/esunalivio">@EsUnalivio</a>! </p>
          <h6>Si algo salió mal por favor dínoslo a <a href="mailto:contacto@unalivio.com">contacto@unalivio.com</a> o respondiendo a éste correo, estamos para servirte.</h6>
        </div>`
      }
  
      await sendmail(mail);
      return;
    } else if(!order.settled && !order.reference && !order.provider) {
      const mail = {
        from: functions.config().gmail.user,
        to: order.from,
        bcc: functions.config().unalivio.bcc,
        subject: `UnAlivio para ${order.to} de ${order.amount} Bs. S.  ya fué cobrado 👏`,
        html: `<div>
          <h1>¡El cargo de UnAlivio ya fué realizado!</h1>
          <br />
          <p>Confirmamos el pago de tu orden con código #${context.params.orderId}:</p>
          <ul style="font-size:80%">
            <li>Teléfono: ${order.to}</li>
            <li>Recarga: ${order.amount} Bs. S</li>
            <li>Cargo a tu tarjeta: ${order.price} MXN</li>
            <li>Fecha y hora de recepción: ${order.created.toDate().toLocaleString(locale, options)}</li>
            <li>Fecha y hora de cobro: ${order.succeeded.toDate().toLocaleString(locale, options)}</li>
          </ul>
          <br />
          <p>Muy pronto le llegará unalivio al celular de tu ser querido! ✨</p>
          <h6>Si algo salió mal por favor dínoslo a <a href="mailto:contacto@unalivio.com">contacto@unalivio.com</a> o respondiendo a éste correo, estamos para servirte.</h6>
        </div>`
      }
  
      await sendmail(mail);
      return;
    }

  }

});

