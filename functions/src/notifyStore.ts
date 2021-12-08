import * as moment from "moment-timezone";
import * as functions from "firebase-functions";
/* const locale = "es-MX"; */

/* const options = {
  timeZone: "America/Mexico_City",
}; */
export const notifyCreation = () =>
  functions.firestore
    .document("orders/{orderId}")
    .onCreate(async (snap, context) => {
      const order = snap.data();

      if (!order) {
        console.error("Orden vacía");
        return;
      }

      /*  const rate = (await order.rate.get()).data(); */

      /*  if (!rate) {
        console.error("Tasa vacía");
        return;
      } */

      /*  const mail = {
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
        <li>Fecha y hora de recepción: ${order.created
          .toDate()
          .toLocaleString(locale, options)}</li>
      </ul>
      <br />
      <p>El siguiente paso es que tu orden se cobrará, y le haremos llegar la recarga a tu ser querido! Relájate y nosotros te mantenemos informados con dos correos más. 😌</p>
      <h6>Si algo salió mal por favor dínoslo a <a href="mailto:contacto@unalivio.com">contacto@unalivio.com</a> o respondiendo a éste correo, estamos para servirte.</h6>
    </div>`,
      }; */

      /*  await sendmail(mail); */
      /* if (!!order.giveaway) {
        await snap.ref.update({
          succeeded: new Date(),
        });
      } */
    });

const parsedate = (date: string | number) =>
  moment.tz(date, "America/Chicago").toDate();

export const notifyUpdate = (deleter: FirebaseFirestore.FieldValue) =>
  functions.firestore
    .document("orders/{orderId}")
    .onUpdate(async (change, context) => {
      const order = change.after.data();
      if (!order) return;

      if (order.succeeded) {
        if (order.settled && order.reference && order.provider) {
          if (order.notifiedDelivery) {
            /*  const mail = {
              from: functions.config().gmail.user,
              to: order.from,
              bcc: functions.config().unalivio.bcc,
              subject: `Has enviado UnAlivio a ${order.to} por ${order.amount} Bs. S. 🥳`,
              html: `<div>
            <h1>¡Tu Alivio ya fué Recargado!</h1>
            <br />
            <p>Confirmamos haber completado la recarga de tu orden con código #${
              context.params.orderId
            }:</p>
            <ul>
              <li>Teléfono: ${order.to}</li>
              <li>Recarga: ${order.amount} Bs. S</li>
              <li>Cargo a tu tarjeta: ${order.price} MXN</li>
              <li>Fecha y hora de recepción: ${order.created
                .toDate()
                .toLocaleString(locale, options)}</li>
              <li>Fecha y hora de cobro: ${order.succeeded
                .toDate()
                .toLocaleString(locale, options)}</li>
              <li>Fecha y hora de recarga: ${order.settled
                .toDate()
                .toLocaleString(locale, options)}</li>
            </ul>
            <br />
            <p>Tu ser querido ha sido aliviado, llámalo que ya tiene saldo! </p><br />
            <p>Gracias y cuéntanos que opinas en Instagram <a target="_blank" href="https://instagram.com/esunalivio">@EsUnalivio</a>! </p>
            <h6>Si algo salió mal por favor dínoslo a <a href="mailto:contacto@unalivio.com">contacto@unalivio.com</a> o respondiendo a éste correo, estamos para servirte.</h6>
          </div>`,
            }; */

            /*  await sendmail(mail); */
            return;
          } else {
            const dates: any = {
              notifiedDelivery: new Date(),
            };

            //if (typeof order.created === 'string' || typeof order.created === 'number') dates.created = moment(order.created).tz('America/Los_Angeles').toDate();
            //if (typeof order.succeeded === 'string' || typeof order.succeeded === 'number') dates.succeeded = moment(order.succeeded).tz('America/Los_Angeles').toDate();
            //if (typeof order.settled === 'string' || typeof order.settled === 'number') dates.settled = moment(order.settled).tz('America/Los_Angeles').toDate();

            if (
              typeof order.created === "string" ||
              typeof order.created === "number"
            )
              dates.created = parsedate(order.created);
            if (
              typeof order.succeeded === "string" ||
              typeof order.succeeded === "number"
            )
              dates.succeeded = parsedate(order.succeeded);
            if (
              typeof order.settled === "string" ||
              typeof order.settled === "number"
            )
              dates.settled = parsedate(order.settled);

            await change.after.ref.update(dates);
            return;
          }
        } else if (!order.settled && !order.reference && !order.provider) {
          if (order.notifiedCharge) {
            /*  const mail = {
              from: functions.config().gmail.user,
              to: order.from,
              bcc: functions.config().unalivio.bcc,
              subject: `UnAlivio para ${order.to} de ${order.amount} Bs. S.  ya fué cobrado 👏`,
              html: `<div>
            <h1>¡El cargo de UnAlivio ya fué realizado!</h1>
            <br />
            <p>Confirmamos el pago de tu orden con código #${
              context.params.orderId
            }:</p>
            <ul style="font-size:80%">
              <li>Teléfono: ${order.to}</li>
              <li>Recarga: ${order.amount} Bs. S</li>
              <li>Cargo a tu tarjeta: ${order.price} MXN</li>
              <li>Fecha y hora de recepción: ${order.created
                .toDate()
                .toLocaleString(locale, options)}</li>
              <li>Fecha y hora de cobro: ${order.succeeded
                .toDate()
                .toLocaleString(locale, options)}</li>
            </ul>
            <br />
            <p>Muy pronto le llegará unalivio al celular de tu ser querido! ✨</p>
            <h6>Si algo salió mal por favor dínoslo a <a href="mailto:contacto@unalivio.com">contacto@unalivio.com</a> o respondiendo a éste correo, estamos para servirte.</h6>
          </div>`,
            }; */

            /*     await sendmail(mail); */
            return;
          } else {
            const dates: any = {
              notifiedCharge: new Date(),
            };

            //if (typeof order.created === 'string' || typeof order.created === 'number') dates.created = moment(order.created).tz('America/Los_Angeles').toDate();
            //if (typeof order.succeeded === 'string' || typeof order.succeeded === 'number') dates.succeeded = moment(order.succeeded).tz('America/Los_Angeles').toDate();

            if (
              typeof order.created === "string" ||
              typeof order.created === "number"
            )
              dates.created = parsedate(order.created);
            if (
              typeof order.succeeded === "string" ||
              typeof order.succeeded === "number"
            )
              dates.succeeded = parsedate(order.succeeded);

            await change.after.ref.update(dates);
            return;
          }
        }
        return;
      }
      return;
    });
