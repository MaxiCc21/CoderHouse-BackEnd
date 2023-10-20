const { ticketService, productService, cartService } = require("../service");
const mercadopago = require("../config/mercadopago");
const { logger } = require("handlebars");
const { PORT } = require("../config/objetConfig");

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

  MercadoPagoResponseGET = async (req, res) => {
    const { pid } = req.params;
    const JWTuser = req.user;
    if (req.query.status === "approved") {
      const foundTicket = await ticketService.getTicket(pid);

      if (foundTicket.ok) {
        const compraRealizada = await ticketService.purchaseMade(pid);

        const newTicketData = {
          id_user_to_ticket: JWTuser.sub,
          username: JWTuser.username,
          email: JWTuser.email,
        };

        const createNewTicket = await ticketService.createNewTicket(
          newTicketData
        );

        const cleanCart = await cartService.cleanCart(pid);
      } else {
        const foundProduct = await productService.getProductById(pid);

        const newTicketData = {
          id_user_to_ticket: JWTuser.sub,
          username: JWTuser.username,
          email: JWTuser.email,
          isSend: true,
          total: foundProduct.price,
          paymentMethod: "Mercado Pago",
          merchantOrder: req.query.merchant_order_id,
          purchaseDetails: [
            {
              product: foundProduct.title,
              quantity: 1,
              unitPrice: foundProduct.price,
              mainImg: foundProduct.thumbnail,
            },
          ],
        };

        const createTicket = await ticketService.createNewTicket(newTicketData);
      }
    }

    res.redirect("/home");
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

    let back_urls;
    if (PORT == 8080) {
      back_urls = {
        success: `http://localhost:8080/comprar/mercadopago-response/${userID}`,
        failure: `http://localhost:8080/comprar/mercadopago-response/${userID}`,
        pending: `http://localhost:8080/comprar/mercadopago-response/${userID}`,
      };
    } else {
      back_urls = {
        success: `https://mymercadopago.onrender.com/comprar/mercadopago-response/${userID}`,
        failure: `https://mymercadopago.onrender.com/mercadopago-response/${userID}`,
        pending: `https://mymercadopago.onrender.com/mercadopago-response/${userID}`,
      };
    }

    const ticketEdited = await ticketService.editTicketShipment(
      userID,
      address,
      tipoDeEnvio
    );

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
      back_urls,
      auto_return: "approved",
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
  };
}

module.exports = new ComprarController();
