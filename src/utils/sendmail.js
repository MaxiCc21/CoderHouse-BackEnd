const nodemailer = require("nodemailer");
const { GMAIL_USER_APP, GMAIL_PASS_APP } = require("../config/config");

const tranport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: GMAIL_USER_APP,
    pass: GMAIL_PASS_APP,
  },
});

exports.sendMail = async (to, subject, html) => {
  return await tranport.sendMail({
    from: "Coder Test <maxi21498@gmail.com>",
    to,
    subject,
    html,
    attachments: [],
  });
};
