const { Router, response, request } = require("express");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const { cartGET, cartPOST } = require("../controller/cart.controller");
const { cartService, ticketService } = require("../service");

const cartHandle = new (require("../dao/MongoManager/CartManager"))();
const router = Router();
const { PROD_ACCESS_TOKEN } = require("../config/objetConfig");

router.get("/", passportAuth("jwt"), authorizaton("user", "premium"), cartGET);

//---------------------- Mercado Pago ----------------------
const mercadopago = require("mercadopago");
require("dotenv").config();

mercadopago.configure({
  access_token: PROD_ACCESS_TOKEN,
});

router.get("/shopmethomp", (req, res) => {
  res.render("mp");
});

//---------------------- Mercado Pago ----------------------
router.post(
  "/",
  passportAuth("jwt"),
  authorizaton("user", "premium"),
  cartPOST
);

module.exports = router;
