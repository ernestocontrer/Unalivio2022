// import nodemailer (after npm install nodemailer)
import * as nodemailer from 'nodemailer';

// config for mailserver and mail
const config = {
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'yutfggtgifd7ixet@ethereal.email',
    pass: 'tX29P4QNadD7kAG7x5'
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