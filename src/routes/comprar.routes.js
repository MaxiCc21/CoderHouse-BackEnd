const { Router } = require("express");
const { get } = require("mongoose");
const { ticketService } = require("../service/idex");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");

const router = Router();

router.post("/", async (req, res) => {
  const uid = "6498fe95739102139e720fbf";
  console.log("/Comprar #POST");

  const dataTicketGenerated = await ticketService.generateDataToTicket(uid);

  if (!dataTicketGenerated.ok) {
    res.status(412).send(dataTicketGenerated.statusMsj);
  }
  const dataTicket = dataTicketGenerated.data;
  const ticketCreate = await ticketService.generateTicket(dataTicket);

  if (!ticketCreate.ok) {
    res.send(ticketCreate);
  }
  res.send(ticketCreate);
});

router.get("/done", (req, res) => {
  const htmlResponse = `
    <html>
      <head>
        <title>Redirección</title>
        <meta http-equiv="refresh" content="5;URL='/home'">
      </head>
      <body>
        <p>Redireccionando a la nueva página en 5 segundos...</p>
      </body>
    </html>
  `;
  // res.send(htmlResponse);
  res.render("done.handlebars");
});

router.get(
  "/shipment",
  passportAuth("jwt"),
  authorizaton("user"),
  (req, res) => {
    const jwtUser = req.user;
    console.log(jwtUser);
    const options = {
      title: "Comprar producto",
      style: "shopping.css",

      usercookie: jwtUser,
    };

    res.render("shopping/shopping", options);
  }
);

// router.post("/methodPayment", (req, res) => {
//   const shippingWay = req.body;

//   res.redirect("/comprar/prueba?dato=" + shippingWay);
// });
router.post("/methodPayment", (req, res) => {
  console.log(req.body, "BODYYY");
  const options = {
    style: "methodPayment.css",
    data: req.body,
  };

  res.render("shopping/methodPayment", options);
});

router.get("/methodPayment", (req, res) => {
  res.redirect("/comprar/shipment");
});

router.post("/prueba", (req, res) => {
  console.log(req.params, "asdasdsd");
  res.render("shopping/prueba");
});
module.exports = router;
