import * as functions from "firebase-functions";

export const mailSuccess = (email: string) => {
  return {
    from: functions.config().gmail.user,
    to: email,
    bcc: functions.config().unalivio.bcc,
    subject: `Solicitaste UnAlivio a  por  Bs. S  🙌`,
    html: `<div style="color:green">
         success
    </div>`,
  };
};

export const mailUnsuccess = (email: string) => {
  return {
    from: functions.config().gmail.user,
    to: email,
    bcc: functions.config().unalivio.bcc,
    subject: `Solicitaste UnAlivio a  por  Bs. S  🙌`,
    html: `<div style="color:red">
         unsuccess
    </div>`,
  };
};
