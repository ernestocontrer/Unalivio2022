import * as functions from "firebase-functions";

/* const locale = "es-MX";

const options = {
  timeZone: "America/Mexico_City",
}; */
export const test = (from: string, filename: any, buffer: any) => {
  return {
    from: functions.config().gmail.user,
    to: from,
    bcc: functions.config().unalivio.bcc,
    subject: `Solicitaste UnAlivio a  por  Bs. S  🙌`,
    html: `<div>
    Hello
  </div>`,
    attachments: [
      {
        filename,
        content: buffer,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  };
};
export const mailPreOrder = (data: any, order: any) => {
  return {
    from: functions.config().gmail.user,
    to: data.from,
    bcc: functions.config().unalivio.bcc,
    subject: `Solicitaste UnAlivio a  por  Bs. S  🙌`,
    html: `<div>
    <a href="https://unalivio.com"><img src="cid:unique@header.ee"></a>
    <h1>¡Recibimos tu solicitud!</h1>
    <br />
    <p>Hemos recibido tu orden con código ${order.id}:</p>
    <ul>
      <li>Teléfono: ${data.to}</li>
      <li>Recarga: ${data.price} Bs. S</li>
      <li>Fecha y hora de recepción: #${data.created}</li>
    </ul>
    <br />
    <p>El siguiente paso es que tu orden se completará automáticamente, y haremos llegar la recarga al número que nos indicaste! </p>
    <p>Relájate que nosotros te mantenemos informados por correo. Es muy rápido!😌 </p>
    <p>Siguenos en instagram y conoce nuestras novedades y premios <a href="https://www.instagram.com/esunalivio/">@esunalivio!</a></p>
  </div>`,
    attachments: [
      {
        filename: "preOrder.png",
        path: "./preOrder.png",
        cid: "unique@header.ee",
      },
    ],
  };
};

export const mailSuccess = (
  data: any,
  timePayollResponce: any,
  timePagoResponce: any,
  id: any,
) => {
  return {
    from: functions.config().gmail.user,
    to: data.from,
    bcc: functions.config().unalivio.bcc,
    subject: `Solicitaste UnAlivio a  por  Bs. S  🙌`,
    html: `<div>
    <a href="https://unalivio.com"><img src="cid:unique@success.ee"></a>
    <h1>¡Tu orden fue procesada y Recargada!</h1>
    <br />
    <p>Hemos recibido tu orden con código ${id}:</p>
    <ul>
      <li>Teléfono: ${data.to}</li>
      <li>Recarga: ${data.price} Bs. S</li>
      <li>Fecha y hora de recepción: ${data.created}</li>
      <li>Fecha y hora de cobro: ${timePagoResponce}</li>
      <li>Fecha y hora de recarga: ${timePayollResponce}</li>
    </ul>
    <br />
    <p>El celular que querías recargar ha sido aliviado, llama que ya tiene saldo!</p>
    <br />
    <br />
    <p>¡Comparte este correo para que algún pana gane saldo adicional en su recarga, compártele el código secreto XXXXX!</p>
    <br/>
    <p>*Valido hasta 31 Dic 2021, una vez por número de teléfono</p>
    <br />
    <br />
    <strong>Si algo salió mal por favor dínoslo a <span style="color:blue">contacto@unalivio.com</span> o respondiendo a éste correo, estamos para servirte.
    </strong>
  </div>`,
    attachments: [
      {
        filename: "success.png",
        path: "./success.png",
        cid: "unique@success.ee",
      },
    ],
  };
};
export const mailUnSuccess = (message: any, data: any, time: any, id: any) => {
  return {
    from: functions.config().gmail.user,
    to: data.from,
    bcc: functions.config().unalivio.bcc,
    subject: `Solicitaste UnAlivio a  por  Bs. S  🙌`,
    html: `<div>
     <h1>${message}</h1>
    <h1>¡Hubo un problema en tu solicitud!</h1>
    <br />
    <p>Hemos recibido tu orden con código ${id}:</p>
    <ul>
      <li>Teléfono: ${data.to}</li>
      <li>Recarga: ${data.price} Bs. S</li>
      <li>Fecha y hora de recepción: ${time}</li>
    </ul>
    <br />
    <p>Sin embargo, al intentar cobrar tu orden la misma registró una falla y no fue cobrada, por loque no se hará la rearga, ni el cobro. Por favor te pedimos ingresar de nuevo a unalivio.com y recargar el número que deseas! Seguimos en contacto, te esperamos!
    </p>
    <br/>
    <br/>
    <p>Si tienes cualquier duda por favor escribenos a <i style ="color:blue">contacto@unalivio.com </i> y por allí te atenderemos! 
    <br/>
    <p>Gracias!</p>
    <br/>
    <br/>
    <br/>
    <br/>
    <p>Carlos de Unalivio.com!</p>
  </div>`,
  };
};
export const mailExcel = (email: string) => {
  return {
    from: functions.config().gmail.user,
    to: email,
    bcc: functions.config().unalivio.bcc,
    subject: `orders`,
    html: `<div>
    orders
  </div>`,
    attachments: [
      {
        filename: "orders.xlsx",
        path: "./orders.xlsx",
      },
    ],
  };
};
