import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import Stripe from 'stripe';
import {verifyApp} from './orders/verify.app';
//import sendmail from './sendmail';

const config: Stripe.StripeConfig = {
  'apiVersion': '2020-03-02',
  'timeout': 90000
}

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const stripe = new Stripe(functions.config().stripe.secret_key, config);

export const generate = functions.https.onCall(async (order, context) => {
  const {product, amount, from, to} = order;

  if (!product || !amount || !from || !to) {
    const up = new functions.https.HttpsError(
      'invalid-argument', 'Por favor rellena todos los campos correctamente');
    throw up;
  }
  

  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.ceil(amount * 1e2),
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
      status: db.doc('status/incomplete'),
      created: timestamp,
      updated: timestamp
    });
    
    return intent;
  } catch (err) {
    console.error(err);
    const up = new functions.https.HttpsError('internal', 'Imposible crear intento de pago');
    throw up;
  }
});

export const verify = functions.https.onRequest(verifyApp(stripe, {
  'payment_intent.succeeded': async (intent: Stripe.PaymentIntent) => {
    // TODO: actualiza la orden con status paying
    
    console.log("Succeeded:", intent.id);
  },
  'payment_intent.payment_failed': async (intent: Stripe.PaymentIntent) => {
    const message = intent.last_payment_error && intent.last_payment_error.message;
    console.error('Failed:', intent.id, message);
  }
}));

export const notifyCreation = functions.firestore.document('orders/{orderId}').onCreate((snap, context) => {
  // If we set `/users/marie/incoming_messages/134` to {body: "Hello"} then
  // context.params.userId == "marie";
  // context.params.messageCollectionId == "incoming_messages";
  // context.params.messageId == "134";
  // ... and ...
  // change.after.data() == {body: "Hello"}

  console.log(snap.data());
  // const {
  //   paymentIntent
  // } = snap.data();


  if (!!snap.data()) {
    return
    //const up = new Error()
  }

  const mail =  {
    from: 'contacto@unalivio.com',
    to: 'enrique@unalivio.com',//snap.data().from,
    cco: 'ernes.contreras@gmail.com',
    subject: 'Gracias por usar Un Alivio!',
    text: `Pronto haremos la recarga a tu mamá`
  }
  console.log(mail)
  // mandarle mail al cliente avisando
  // orderId
  // teléfono
  // cantidad
  // producto

  // mandarle mail a Ernesto con
  // paymentIntent de stripe
  // order ref

});

//export const notifyUpdate = functions.firestore.document('orders/{orderId}').onCreate((snap, context) => {
//  
//})