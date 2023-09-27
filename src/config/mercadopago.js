const mercadopago = require("mercadopago");

const { PROD_ACCESS_TOKEN: ll } = require("../config/config");

console.log(PROD_ACCESS_TOKEN);
console.log(ll, "llllllllllllll");
console.log("NO ENTRS??");

mercadopago.configure({
  access_token: process.env.PROD_ACCESS_TOKEN,
});

module.exports = mercadopago;
