const { Router, response, request } = require("express");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const { cartGET, cartPOST } = require("../controller/cart.controller");
const { cartService, ticketService } = require("../service");

const cartHandle = new (require("../dao/MongoManager/CartManager"))();
const router = Router();

router.get("/", passportAuth("jwt"), authorizaton("user", "premium"), cartGET);

//---------------------- Mercado Pago ----------------------
const mercadopago = require("mercadopago");
require("dotenv").config();

mercadopago.configure({
  access_token: process.env.PROD_ACCESS_TOKEN,
});

router.get("/shopmethomp", (req, res) => {
  res.render("mp");
});

router.post("/shopmethomp", (req, res) => {
  const preference = {
    items: [
      {
        title: "Camiseta de fútbol",
        description: "Camiseta oficial del equipo",
        unit_price: 2500,
        quantity: 2,
        currency_id: "ARS",
        picture_url: "https://example.com/camiseta.jpg",
        category_id: "ropa",
        id: "123456",
        external_reference: "producto-123",
      },
    ],
  };
  mercadopago.preferences
    .create(preference)
    .then((response) => {
      res.redirect(response.body.init_point);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Algo sali mal");
    });
});

//---------------------- Mercado Pago ----------------------
router.post(
  "/",
  passportAuth("jwt"),
  authorizaton("user", "premium"),
  cartPOST
);

module.exports = router;
