import * as functions from "firebase-functions";
const locale = "es-MX";

const options = {
  timeZone: "America/Mexico_City",
};
export const mailSuccess = (data: any, order: any) => {
  return {
    from: functions.config().gmail.user,
    to: data.from,
    bcc: functions.config().unalivio.bcc,
    subject: `Solicitaste UnAlivio a  por  Bs. S  🙌`,
    html: `<div>
    <a href="https://unalivio.com"><img src="cid:unique@header.ee"></a>
    <h1>¡Recibimos tu solicitud!</h1>
    <br />
    <p>Hemos recibido tu orden con código #${order.id}:</p>
    <ul>
      <li>Teléfono: ${data.to}</li>
      <li>Recarga: ${data.amount} Bs. S</li>
      <li>Fecha y hora de recepción: ${order.created
        .toDate()
        .toLocaleString(locale, options)}</li>
    </ul>
    <br />
    <p>El siguiente paso es que tu orden se completará automáticamente, y haremos llegar la recarga al número que nos indicaste! </p>
    <p>Relájate que nosotros te mantenemos informados por correo. Es muy rápido!😌 </p>
    <p>Siguenos en instagram y conoce nuestras novedades y premios <a href="https://www.instagram.com/esunalivio/">@esunalivio!</a></p>
  </div>`,
    attachments: [
      {
        filename: "header.png",
        path: "./header.png",
        cid: "unique@header.ee", //same cid value as in the html img src
      },
    ],
  };
};

export const mailUnsuccess = (data: any, order: any) => {
  return {
    from: functions.config().gmail.user,
    to: data.from,
    bcc: functions.config().unalivio.bcc,
    subject: `Solicitaste UnAlivio a  por  Bs. S  🙌`,
    html: `<div>
    <a href="https://unalivio.com"><img src="cid:unique@header.ee"></a>
    <h1>¡Recibimos tu solicitud!</h1>
    <br />
    <p>Hemos recibido tu orden con código #${order.id}:</p>
    <ul>
      <li>Teléfono: ${data.to}</li>
      <li>Recarga: ${data.amount} Bs. S</li>
      <li>Fecha y hora de recepción: ${order.created
        .toDate()
        .toLocaleString(locale, options)}</li>
    </ul>
    <br />
    <p>El siguiente paso es que tu orden se completará automáticamente, y haremos llegar la recarga al número que nos indicaste! </p>
    <p>Relájate que nosotros te mantenemos informados por correo. Es muy rápido!😌 </p>
    <p>Siguenos en instagram y conoce nuestras novedades y premios <a href="https://www.instagram.com/esunalivio/">@esunalivio!</a></p>
  </div>`,
    attachments: [
      {
        filename: "header.png",
        path: "./header.png",
        cid: "unique@header.ee", //same cid value as in the html img src
      },
    ],
  };
};
/*  return {
    from: functions.config().gmail.user,
    to: email,
    bcc: functions.config().unalivio.bcc,
    subject: `Solicitaste UnAlivio a  por  Bs. S  🙌`,
    html: `<div style="color:red">
         unsuccess
    </div>`, */
