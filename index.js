const axios = require("axios");
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");

const baseUrl = "https://github.com";
const headers = {
  "X-Requested-With": "XMLHttpRequest",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36(KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
};
const config = {
  headers
};
const user=process.env.SENDER;
const pass=process.env.PASSWORD;

let transporter = nodemailer.createTransport({
  host: "smtp.163.com",
  port: 25,
  secure: false, // true for 465, false for other ports
  auth: {
    user, 
    pass 
  }
});
const from = '"Cyan Pub👻" <cpz_github_pub@163.com>';
let mailOptions = {
  from,
  to: "461354294@qq.com"
};
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
let latestIssue = "";
let num = "";
axios
  .get("https://github.com/ruanyf/weekly", config)
  .then(res => {
    const url = res.data.match('<a href="(.*?.md)">(.*?)</a>');
    latestIssue = baseUrl + url[1];
    num = url[2];
    return axios.get(latestIssue, config);
  })
  .then(res => {
    const $ = cheerio.load(res.data);
    const article = $("article").html();
    const subject = `📅阮一峰技术周刊${num}`;
    const content = `<html lang="en">
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
        <div>
            <a href="${latestIssue}">${subject}</a>
            ${article}
        <div>
    </body>
    </html>`;
    sendEmail(content, subject);
  })
  .catch(console.log);
