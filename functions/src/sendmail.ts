import * as nodemailer from "nodemailer";
//import * as sgMail from '@sendgrid/mail';
import * as functions from "firebase-functions";

const sgTransport = require("nodemailer-sendgrid-transport");

// import nodemailer (after npm install nodemailer)

// config for mailserver and mail
const options = {
  //service: 'gmail',
  auth: {
    api_key: functions.config().sendgrid.api_key,
    //user: functions.config().gmail.user,
    //pass: functions.config().gmail.pass // naturally, replace both with your real credentials or an application-specific password
  },
};

const sendmail = (mail: any) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(sgTransport(options));

    transporter.sendMail(mail, (error, info) => {
      if (error) {
        console.log("error is " + error);
        resolve(false);
      } else {
        resolve(true);
        console.log("Email sent: " + info.response);
      }
    });
  });
};

export default sendmail;
