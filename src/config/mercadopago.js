const mercadopago = require("mercadopago");
require("dotenv").config();

mercadopago.configure({
  access_token: process.env.VENDEDOR_PROD_ACCESS_TOKEN,
});

module.exports = mercadopago;
