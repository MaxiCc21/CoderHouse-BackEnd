// const mercadopago = require("mercadopago");

// const { PROD_ACCESS_TOKEN } = require("../config/objetConfig");

// mercadopago.configure({
//   access_token: PROD_ACCESS_TOKEN,
// });

// module.exports = mercadopago;
const mercadopago = require("mercadopago");
const { PROD_ACCESS_TOKEN } = require("../config/objetConfig");

mercadopago.configure({
  access_token: PROD_ACCESS_TOKEN,
});

module.exports = mercadopago;
