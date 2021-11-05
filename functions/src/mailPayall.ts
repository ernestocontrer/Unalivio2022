import * as functions from "firebase-functions";

export const mailSuccess = {
  from: functions.config().gmail.user,
  to: "devtestfornov@gmail.com",
  bcc: functions.config().unalivio.bcc,
  subject: `Solicitaste UnAlivio a  por  Bs. S  🙌`,
  html: `<div style="color:'green'">
       success
  </div>`,
};

export const mailUnsuccess = {
  from: functions.config().gmail.user,
  to: "devtestfornov@gmail.com",
  bcc: functions.config().unalivio.bcc,
  subject: `Solicitaste UnAlivio a  por  Bs. S  🙌`,
  html: `<div style="color:'green'">
       unsuccess
  </div>`,
};
