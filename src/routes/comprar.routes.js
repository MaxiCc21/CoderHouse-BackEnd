const { Router } = require("express");
const { get } = require("mongoose");
const { ticketService } = require("../service");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");

const router = Router();

router.get("/", passportAuth("jwt"), authorizaton("user"), (req, res) => {
  const jwtUser = req.user;
  console.log(jwtUser);
  const options = {
    title: "Comprar producto",
    style: "shopping.css",

    usercookie: jwtUser,
  };

  res.render("shopping/shopping", options);
});

router.post(
  "/prueba",
  passportAuth("jwt"),
  authorizaton("user"),
  async (req, res) => {
    const userID = req.user.sub;
    const { address, ...shippingType } = req.body;
    let tipoDeEnvio;
    if (Object.keys(shippingType)[0] == "sendInput") {
      tipoDeEnvio = "Envio a domicilio";
    } else {
      tipoDeEnvio = "Retirar en local";
    }
    // const found = await ticketService.validationSend("6498fe95739102139e720fbf");
    const ticketEdited = await ticketService.editTicketShipment(
      userID,
      address,
      tipoDeEnvio
    );
    console.log(ticketEdited.statusMsj);
    if (ticketEdited.ok) {
      res.redirect("/comprar/methodPayment");
    } else {
      res.status(400).send(ticketEdited.statusMsj);
    }
  }
);

// router.post("/", async (req, res) => {
//   const uid = "6498fe95739102139e720fbf";
//   console.log("/Comprar #POST");

//   const dataTicketGenerated = await ticketService.generateDataToTicket(uid);

//   if (!dataTicketGenerated.ok) {
//     res.status(412).send(dataTicketGenerated.statusMsj);
//   }

//   const dataTicket = dataTicketGenerated.data;
//   const ticketCreate = await ticketService.generateTicket(dataTicket);

//   if (!ticketCreate.ok) {
//     res.send(ticketCreate);
//   }
//   res.send(ticketCreate);
// });

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

// router.get(
//   "/shipment",
//   passportAuth("jwt"),
//   authorizaton("user"),
//   (req, res) => {
//     const jwtUser = req.user;
//     console.log(jwtUser);
//     const options = {
//       title: "Comprar producto",
//       style: "shopping.css",

//       usercookie: jwtUser,
//     };

//     res.render("shopping/shopping", options);
//   }
// );

// // router.post("/methodPayment", (req, res) => {
// //   const shippingWay = req.body;

// //   res.redirect("/comprar/prueba?dato=" + shippingWay);
// // });
router.get("/methodPayment", (req, res) => {
  console.log(req.body, "BODYYY");
  const options = {
    style: "methodPayment.css",
    data: req.body,
  };

  res.render("shopping/methodPayment", options);
});

router.post(
  "/methodPayment",
  passportAuth("jwt"),
  authorizaton("user"),
  async (req, res) => {
    const userID = req.user.sub;
    const { username, email } = req.user;

    const metodoDePago = Object.keys(req.body)[0];
    const datosDeTarjeta = req.body[metodoDePago];

    const ticketEdit = await ticketService.editTicketMethodPayment(
      userID,
      metodoDePago,
      datosDeTarjeta
    );
    const compraRealizada = await ticketService.purchaseMade(userID);

    const dataToNewTicket = {
      id_user_to_ticket: userID,
      username,
      email,
    };

    const createNewTicket = await ticketService.createNewTicket(
      dataToNewTicket
    );
    console.log(createNewTicket.statusMsj);

    res.redirect("/comprar/done");
  }
);

// router.get("/methodPayment", (req, res) => {
//   res.redirect("/comprar/shipment");
// });

module.exports = router;
