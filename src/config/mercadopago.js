const mercadopago = require("mercadopago");

const { PROD_ACCESS_TOKEN: ll } = require("../config/config");

mercadopago.configure({
  access_token: process.env.PROD_ACCESS_TOKEN,
});

module.exports = mercadopago;
