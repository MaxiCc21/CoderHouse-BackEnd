const nodemailer = require("nodemailer");
const config = require("../config/objetConfig");

const tranport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.gmail_user_app,
    pass: config.gmail_pass_app,
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
