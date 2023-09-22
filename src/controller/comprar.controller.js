const { get } = require("mongoose");
const { ticketService } = require("../service");
const mercadopago = require("../config/mercadopago");

class ComprarController {
  shopingGET = async (req, res) => {
    const jwtUser = req.user;
    const options = {
      title: "Comprar producto",
      style: "shopping.css",
      usercookie: jwtUser,
    };

    res.render("shopping/shopping", options);
  };

  shoppingPOST = async (req, res) => {
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
    console.log(ticketEdited);

    const dataTicket = await ticketService.getTicket(userID);

    const allProducts = [];

    dataTicket.data.purchaseDetails.forEach((el) => {
      allProducts.push({
        title: el.product,
        unit_price: el.unitPrice,
        quantity: el.quantity,
        currency_id: "ARS",
        picture_url: el.mainImg,
        id: el._id,
      });
    });

    const preference = {
      items: allProducts,
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

    // if (ticketEdited.ok) {
    //   res.redirect("/comprar/methodPayment");
    // } else {
    //   res.status(400).send(ticketEdited.statusMsj);
    // }
  };

  methodPaymentGET = async (req, res) => {
    const JWTuser = req.user;

    const options = {
      style: "methodPayment.css",
      data: req.body,
      usercookie: JWTuser,
    };

    res.render("shopping/methodPayment", options);
  };

  methodPaymentPOST = async (req, res) => {
    const userID = req.user.sub;
    const data = req.user;

    const metodoDePago = Object.keys(req.body)[0];
    const datosDeTarjeta = req.body[metodoDePago];

    const ticketEdit = await ticketService.editTicketMethodPayment(
      userID,
      metodoDePago,
      datosDeTarjeta
    );
    const compraRealizada = await ticketService.purchaseMade(userID);

    const newTicketData = {
      id_user_to_ticket: userID,
      username: data.username,
      email: data.email,
    };

    const createNewTicket = await ticketService.createNewTicket(newTicketData);

    const cleanCart = await cartService.cleanCart(userID);

    res.redirect("/home");
  };

  methodMercadoPagoGET = async (req, res) => {
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
  };
}

module.exports = new ComprarController();
