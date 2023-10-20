const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  MY_NUMBER,
} = require("../config/config");

const twilio = require("twilio");

const cliente = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

exports.sendSms = () => {
  cliente.messages.create({
    body: "Esto es un mensaje de prueba",
    from: TWILIO_PHONE_NUMBER,
    to: MY_NUMBER,
  });
};
