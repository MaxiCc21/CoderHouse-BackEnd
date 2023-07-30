const config = require("../config/objetConfig");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const twilio_account_sid = config.twilio_account_sid;
const twilio_auth_token = config.twilio_auth_token;
const twilio_phone_number = config.twilio_phone_number;

const cliente = twilio(twilio_account_sid, twilio_auth_token);

exports.sendSms = () => {
  cliente.messages.create({
    body: "Esto es un mensaje de prueba",
    from: twilio_phone_number,
    to: config.my_number,
  });
};
