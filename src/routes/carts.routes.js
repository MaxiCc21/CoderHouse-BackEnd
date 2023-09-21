const { Router, response, request } = require("express");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const { cartGET, cartPOST } = require("../controller/cart.controller");
const { cartService, ticketService } = require("../service");

const cartHandle = new (require("../dao/MongoManager/CartManager"))();
const router = Router();

router.get("/", passportAuth("jwt"), authorizaton("user", "premium"), cartGET);

//? router.post("/", async (request, response) => {
//?   let res = await cartHandle.createNewCart();
//?   if (!res) {
//?     response.send("A ocurrido un error");
//?   }
//?   response.send(res);
//? });

//! router.post("/:cid/product/:pid", async (request, response) => {
//!   let { cid } = request.params;
//!   let { pid } = request.params;
//!   let body = { id: 1, name: "hola" };
//!   let res = await cartHandle.addItem(cid, pid, body);
//!   //! console.log(res.status, res.statusMsj);
//!   response.send(res);
//! });

//! //! Delete Item
//! router.delete("/:cid/product/:pid", async (req, res) => {
//!   let { cid, pid } = req.params,
//!     body = req.body;
//!   let found = await cartHandle.getItemById(cid);
//!   console.log(found);
//!   res.send("Hola");
//! });
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
        unit_price: 2500, // 25 pesos argentinos
        quantity: 2, // Se están vendiendo 2 camisetas
        currency_id: "ARS", // Moneda argentina
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
