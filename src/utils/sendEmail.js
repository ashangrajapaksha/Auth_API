const nodemailer = require("nodemailer");
require("dotenv").config();

const EMPT_USER_NAME = process.env.EMPT_USER_NAME;
const EMPT_USER_PASS = process.env.EMPT_USER_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: EMPT_USER_NAME,
    pass: EMPT_USER_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  console.log(to, subject, text);
  await transporter.sendMail({
    from: "ashanrajapaksha954@gmail.com",
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
