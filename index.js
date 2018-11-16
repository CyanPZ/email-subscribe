const axios = require("axios");
const cheerio = require("cheerio");
const { sendEmail } = require("./email");
const baseUrl = "https://github.com";
const headers = {
  "X-Requested-With": "XMLHttpRequest",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36(KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
};
const config = {
  headers
};
/**
 * 获取内容并发送邮件
 */
const fetchAndSend = () => {
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
};

const day = new Date().getDay();
if (day === 6) {
  fetchAndSend();
}
