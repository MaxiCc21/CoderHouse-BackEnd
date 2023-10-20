const { Router, response, request } = require("express");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const nodemailer = require("nodemailer");
const { GMAIL_USER_APP, GMAIL_PASS_APP } = require("../config/config");

const { loadProduct, logOutUser } = require("../controller/home.controller");
const { sendMail } = require("../utils/sendmail");
const { sendSms } = require("../utils/sendSMS");

const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const router = Router();

router.get("/sms", (req, res) => {
  sendSms();
  res.send("Email enviado");
});

const tranport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: GMAIL_USER_APP,
    pass: GMAIL_PASS_APP,
  },
});

router.get("/", async (req, res) => {
  const templateFilePath = path.join(
    __dirname,
    "templates",
    "emailTemplate.hbs"
  );
  const templateSource = fs.readFileSync(templateFilePath, "utf-8");
  const compiledTemplate = handlebars.compile(templateSource);

  const htmlContent = compiledTemplate(templateData);

  const to = "maxi21498@gmail.com";
  const subject = "Correo de prueba";
  const html = htmlContent;
  let resurl = await sendMail(to, subject, html);

  res.send("Email enviado");
});
module.exports = router;
