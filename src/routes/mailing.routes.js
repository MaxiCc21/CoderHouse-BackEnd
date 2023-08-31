const { Router, response, request } = require("express");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const nodemailer = require("nodemailer");
const config = require("../config/objetConfig");

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
    user: config.gmail_user_app,
    pass: config.gmail_pass_app,
  },
});

router.get("/", async (req, res) => {
  // Lee y compila la plantilla Handlebars
  const templateFilePath = path.join(
    __dirname,
    "templates",
    "emailTemplate.hbs"
  );
  const templateSource = fs.readFileSync(templateFilePath, "utf-8");
  const compiledTemplate = handlebars.compile(templateSource);

  // Genera el contenido HTML utilizando la plantilla compilada
  const htmlContent = compiledTemplate(templateData);

  const to = "maxi21498@gmail.com";
  const subject = "Correo de prueba";
  const html = htmlContent;
  let resurl = await sendMail(to, subject, html);

  res.send("Email enviado");
});
module.exports = router;
