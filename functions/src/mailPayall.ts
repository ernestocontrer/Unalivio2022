import * as functions from "firebase-functions";
import { orderInfo } from "./orders";

export const mailSuccess = {
  from: functions.config().gmail.user,
  to: orderInfo.from,
  bcc: functions.config().unalivio.bcc,
  subject: `Solicitaste UnAlivio a ${orderInfo.to} por ${orderInfo.amount} Bs. S  🙌`,
  html: `<div style="color:'green'">
       success
  </div>`,
};

export const mailUnsuccess = {
  from: functions.config().gmail.user,
  to: orderInfo.from,
  bcc: functions.config().unalivio.bcc,
  subject: `Solicitaste UnAlivio a ${orderInfo.to} por ${orderInfo.amount} Bs. S  🙌`,
  html: `<div style="color:'green'">
       unsuccess
  </div>`,
};
