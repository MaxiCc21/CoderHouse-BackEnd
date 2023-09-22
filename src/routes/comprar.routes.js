const { Router } = require("express");
const { get, now } = require("mongoose");
const { ticketService, cartService } = require("../service");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const {
  shopingGET,
  shoppingPOST,
  methodPaymentGET,
  methodPaymentPOST,
  methodMercadoPagoGET,
} = require("../controller/comprar.controller");

const router = Router();

router.get("/", passportAuth("jwt"), authorizaton("user"), shopingGET);

router.post("/", passportAuth("jwt"), authorizaton("user"), shoppingPOST);

router.get("/done", (req, res) => {
  const htmlResponse = `
    <html>
      <head>
        <title>Redirección</title>
        <meta http-equiv="refresh" content="5;URL='/home'">
      </head>
      <body>
        <p>Gracias por comprar con nosotros! :)</p>
      </body>
    </html>
  `;
  // res.send(htmlResponse);
  res.render("done.handlebars");
});

router.get(
  "/methodPayment",
  passportAuth("jwt"),
  authorizaton("user"),
  methodPaymentGET
);

router.post(
  "/methodPaymentMP",
  passportAuth("jwt"),
  authorizaton("user"),
  methodMercadoPagoGET
);

router.post(
  "/methodPayment",
  passportAuth("jwt"),
  authorizaton("user"),
  methodPaymentPOST
);

module.exports = router;
