import * as nodemailer from 'nodemailer';
import * as functions from 'firebase-functions';



// import nodemailer (after npm install nodemailer)


// config for mailserver and mail
const config = {
  service: 'gmail',
  auth: {
    user: functions.config().gmail.user,
    pass: functions.config().gmail.pass // naturally, replace both with your real credentials or an application-specific password
  }
};

const sendmail = async (mail: any) => {
  // create a nodemailer transporter using smtp
  let transporter = nodemailer.createTransport(config);

  // send mail using transporter
  try {
    let info = await transporter.sendMail(mail);
    console.log(`Preview: ${nodemailer.getTestMessageUrl(info)}`);
  } catch(err) {
    console.error(err);
  }
};

export default sendmail;



