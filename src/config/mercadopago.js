// config/mercadopago.js

const mercadopago = require("mercadopago");
require("dotenv").config();

mercadopago.configure({
  access_token: process.env.USER_PRUEBA_ACCESS_TOKE,
});

module.exports = mercadopago;
