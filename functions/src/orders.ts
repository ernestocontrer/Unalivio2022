import * as functions from 'firebase-functions';
import Stripe from 'stripe';
//import Timeout from 'await-timeout';
import * as moment from 'moment-timezone';



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

const currentCoupon = async (db: FirebaseFirestore.Firestore, code: string) => {
  const couponsQuery = await db.collection('coupons').where('name', '==', code).limit(1).get();

  const coupon : any  = (couponsQuery.empty)? undefined : couponsQuery.docs[0].data();
  return coupon;
} 

const validAmounts = async (db: FirebaseFirestore.Firestore) => (await db.collection('amounts').get()).docs.map(
  (doc):number => doc.data().value
)

const validProducts = async (db: FirebaseFirestore.Firestore) => (await db.collection('products').get()).docs.map(
  (doc):string => doc.id
)

const validCoupons = async (db: FirebaseFirestore.Firestore) => (await db.collection('coupons').get()).docs.map(
  (doc):string => doc.data().name
)

const computePrice = (amount: number, rate: number, discount: number = 0):number => (Math.ceil((((amount / rate) - discount + Number.EPSILON) * 100)) / 100) 

export const generate = (
  db: FirebaseFirestore.Firestore, 
  stripe: Stripe
) => functions.https.onCall(async (order, context) => {
  const {product, amount, from, to, coupon, giveaway} = order;

  if (!giveaway) {
    if (!product || !amount || !from || !to) {
      const up = new functions.https.HttpsError(
        'invalid-argument', 'Por favor rellena todos los campos correctamente');
      throw up;
    }
  } else if (!product || !from || !to) {
    const up = new functions.https.HttpsError(
      'invalid-argument', 'Por favor rellena todos los campos correctamente');
    throw up;
  }


  const amounts = await validAmounts(db);
  const rate = await currentRate(db);
  const products = await validProducts(db);
  const coupons = await validCoupons(db);

  try {
    await validate.email('from', from, 'es');
    validate.phone('phone', to, 'es');
    validate.product('product', product, 'es', products);
    
    if (giveaway) {
      validate.product('coupon', coupon, 'es', coupons);
    } else {
      validate.amount('amount', amount, 'es', amounts, rate.data().price);
    }
  } catch(error) {
    const up = new functions.https.HttpsError('invalid-argument', error.message);
    throw up;
  }

  try {
    console.log("pinche")
    const price = computePrice(amount, rate.data().price);
    const timestamp = new Date();

    const order_ : any = {
      product: db.doc(`products/${product}`),
      from,
      to,
      price,
      rate: rate.ref,
      method: db.doc('methods/card'),
      created: timestamp,
    }

    console.log("puto");
    const coupon_ = await currentCoupon(db, coupon);

    if (!!coupon_) {
      order_.coupon = coupon;
      order_.gift = coupon_.gift;
    }

    console.log("mijito");
    let intent : any = {data: {giveaway: true}};
    if (!giveaway) {
      intent = await stripe.paymentIntents.create({ 
        amount: Math.ceil(price * 100),
        currency: 'mxn',
      });
      order_.intent = intent.id;
      order_.amount = amount; 
    } else {
      order_.amount = 0;
      order_.giveaway = true;
    }

    const o = await db.collection('orders').add(order_);

    console.log('Created:', o.id)
    console.log("maricón");

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
  'payment_intent.created': async (intent: Stripe.PaymentIntent) => {
    console.log("Created payment intent:", intent.id);
  },
  'payment_intent.succeeded': async (intent: Stripe.PaymentIntent) => {
    console.log("Succeeded payment intent:", intent.id);
  },
  'charge.succeeded': async (charge: Stripe.Charge) => {
    const timestamp = new Date();
    const snap = await db.collection('orders').where('intent', '==', charge.payment_intent).get();

    snap.forEach(doc => (doc.ref.update({
      succeeded: timestamp,
      charge: charge.id
    })));

    console.log("Succeeded charge:", charge.id);
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

export const notifyCreation = () => functions.firestore.document('orders/{orderId}').onCreate(async (snap, context) => {
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

  await sendmail(mail);

  if (!!order.giveaway) {
    await snap.ref.update({
      succeeded: new Date()
    });
  }
});



const parsedate = (date : string|number) => moment.tz(date, "America/Chicago").toDate()


export const notifyUpdate = (deleter: FirebaseFirestore.FieldValue) => functions.firestore.document('orders/{orderId}').onUpdate(async (change, context) => {
  const order = change.after.data();

  if (!order) return;

  if (order.succeeded) {
    if (order.settled && order.reference && order.provider) {
      if (order.notifiedDelivery) {
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
              <li>Fecha y hora de cobro: ${order.succeeded.toDate().toLocaleString(locale, options)}</li>
              <li>Fecha y hora de recarga: ${order.settled.toDate().toLocaleString(locale, options)}</li>
            </ul>
            <br />
            <p>Tu ser querido ha sido aliviado, llámalo que ya tiene saldo! </p><br />
            <p>Gracias y cuéntanos que opinas en Instagram <a target="_blank" href="https://instagram.com/esunalivio">@EsUnalivio</a>! </p>
            <h6>Si algo salió mal por favor dínoslo a <a href="mailto:contacto@unalivio.com">contacto@unalivio.com</a> o respondiendo a éste correo, estamos para servirte.</h6>
          </div>`
        }
    
        await sendmail(mail);
        return;
      } else {
        const dates : any = {
          notifiedDelivery: (new Date())
        }

        //if (typeof order.created === 'string' || typeof order.created === 'number') dates.created = moment(order.created).tz('America/Los_Angeles').toDate();
        //if (typeof order.succeeded === 'string' || typeof order.succeeded === 'number') dates.succeeded = moment(order.succeeded).tz('America/Los_Angeles').toDate();
        //if (typeof order.settled === 'string' || typeof order.settled === 'number') dates.settled = moment(order.settled).tz('America/Los_Angeles').toDate();

        if (typeof order.created === 'string' || typeof order.created === 'number') dates.created = parsedate(order.created);
        if (typeof order.succeeded === 'string' || typeof order.succeeded === 'number') dates.succeeded = parsedate(order.succeeded);
        if (typeof order.settled === 'string' || typeof order.settled === 'number') dates.settled = parsedate(order.settled);

        await change.after.ref.update(dates);
        return;
      }
    } else if(!order.settled && !order.reference && !order.provider) {
      if (order.notifiedCharge) {
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
      } else {
        const dates : any = {
          notifiedCharge: (new Date())
        }

        //if (typeof order.created === 'string' || typeof order.created === 'number') dates.created = moment(order.created).tz('America/Los_Angeles').toDate();
        //if (typeof order.succeeded === 'string' || typeof order.succeeded === 'number') dates.succeeded = moment(order.succeeded).tz('America/Los_Angeles').toDate();

        if (typeof order.created === 'string' || typeof order.created === 'number') dates.created = parsedate(order.created);
        if (typeof order.succeeded === 'string' || typeof order.succeeded === 'number') dates.succeeded = parsedate(order.succeeded);


        await change.after.ref.update(dates);
        return;
      }
    }
    return;
  }
  return;
});

