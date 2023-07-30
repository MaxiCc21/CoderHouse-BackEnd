const { Router, response, request } = require("express");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const { cartGET } = require("../controller/cart.controller");
const { cartService, ticketService } = require("../service");
const router = Router();
const cartHandle = new (require("../dao/MongoManager/CartManager"))();

router.get("/", passportAuth("jwt"), authorizaton("user"), cartGET);

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

router.post(
  "/",
  passportAuth("jwt"),
  authorizaton("user"),
  async (req, res) => {
    const jwtUser = req.user;
    const { userID } = req.body;
    const foundCart = await cartService.getItemToCart(userID);
    if (!foundCart.ok) {
      return res.status(400).send(foundCart.statusMsj);
    }

    const addProductsTicket = await ticketService.editTicketProducts(
      jwtUser.sub,
      foundCart.data
    );

    if (!addProductsTicket.ok) {
      res.status(400).send(addProductsTicket.statusMsj);
    }
    res.redirect("/comprar");
  }
);

module.exports = router;
