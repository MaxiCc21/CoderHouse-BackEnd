const { cartModel } = require("../models/cart.model");
const { messageModel } = require("../models/messages.model");
const { ticketModel } = require("../models/ticket.model");

function purchaseDetailsGenerate(products) {
  const arrayProducts = [];

  for (let i = 0; i < products.length; i++) {
    const ticket = {
      product: products[i].product.title,
      quantity: products[i].quantity,
      unitPrice: products[i].product.price,
    };

    arrayProducts.push(ticket);
  }

  return arrayProducts;
}

function calculatePricesGenerate(tickeProducts) {
  let subtotal = 0;

  // // Calcular subtotal
  tickeProducts.forEach((product) => {
    subtotal += product.quantity * product.unitPrice;
  });

  const taxes = parseFloat((subtotal * 0.21).toFixed(2));
  const total = parseFloat((subtotal + taxes).toFixed(2));

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxes: taxes,
    total: total,
  };
}

class TicketManager {
  generateTicket = async (ticketData) => {
    try {
      if (Object.keys(ticketData).length === 0) {
        return {
          status: "error",
          statusMsj:
            "No se proporcionó información del ticket. Operación cancelada.",
          ok: false,
          data: null,
          nodata: true,
        };
      }
      if (Object.keys(ticketData).length < 7) {
        return {
          status: "error",
          statusMsj:
            "No se proporcionó toda la información del ticket. Operación cancelada.",
          ok: false,
          data: null,
          nodata: true,
        };
      }

      const generateTicket = await ticketModel.create(ticketData);
      return {
        status: "ok",
        statusMsj: `Gracias por comprar, Ticket generado`,
        ok: true,
        data: generateTicket,
        nodata: false,
      };
    } catch (err) {
      return {
        status: "error",
        statusMsj: `A ocurrido un error al generar el ticket ERROR:${err}`,
        ok: false,
        data: null,
        nodata: false,
      };
    }
  };

  generateDataToTicket = async (uid) => {
    try {
      const cartFound = await cartModel
        .findOne({ id_user_to_cart: uid })
        .lean();
      if (!cartFound) {
        return {
          status: "error",
          statusMsj: "No se encotrado un carrito con dicho ID",
          ok: false,
          data: null,
        };
      }
      const purchaseDetails = purchaseDetailsGenerate(cartFound.products);
      const { subtotal, taxes, total } =
        calculatePricesGenerate(purchaseDetails);

      const newTicket = {
        receiptNumber: 123456789,
        purchaseDetails: purchaseDetails,
        subtotal,
        taxes,
        total,
        paymentMethod: "credit card",
        cardNumber: "**** **** **** 1234",
      };

      return {
        status: "ok",
        statusMsj: "Ticket generado con exito, gracias por su compra",
        ok: true,
        data: newTicket,
      };
    } catch (err) {
      return {
        status: "error",
        statusMsj: `error:${err}`,
        ok: false,
        data: null,
      };
    }
  };
}

module.exports = TicketManager;
