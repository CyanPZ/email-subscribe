const nodemailer = require("nodemailer");
const user = process.env.SENDER;
const pass = process.env.PASSWORD;
const host = process.env.MAIL_HOST;
const port = process.env.MAIL_PORT;
const secure = process.env.SECURE;

let transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user,
    pass
  }
});
const from = user;
let mailOptions = {
  from,
  to: "461354294@qq.com"
};
/**
 *
 * @param {string} content 邮件内容
 * @param {string} subject 邮件主题
 */
const sendEmail = (content, subject) => {
  mailOptions.html = content;
  mailOptions.subject = subject;
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
};

module.exports = { sendEmail };
