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

const sendmail = async (mail: any) => {
  // create a nodemailer transporter using smtp
  const transporter = nodemailer.createTransport(sgTransport(options));

  // send mail using transporter
  try {
    const info = await transporter.sendMail(mail);
    console.log(`Preview: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (err) {
    console.error(err);
  }
}; // test

export default sendmail;
