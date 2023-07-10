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
  "/shopping",
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
module.exports = router;
