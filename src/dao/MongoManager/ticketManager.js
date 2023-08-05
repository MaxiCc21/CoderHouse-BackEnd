const { cartModel } = require("../models/cart.model");
const { messageModel } = require("../models/messages.model");
const { ticketModel } = require("../models/ticket.model");
const { ObjectId } = require("bson");

function purchaseDetailsGenerate(products) {
  const arrayProducts = [];

  for (let i = 0; i < products.length; i++) {
    const ticket = {
      product: products[i].product.title,
      quantity: products[i].quantity,
      unitPrice: products[i].product.price,
      mainImg: products[i].product.thumbnail,
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

function modDataProductToTicket(data) {
  const ArryData = [];
  data.forEach((producto) => {
    let data = {
      product: producto.product.title,
      quantity: producto.quantity,
      unitPrice: producto.product.price,
      mainImg: producto.product.thumbnail,
    };
    ArryData.unshift(data);
  });
  if (ArryData.length === 0) {
    return {
      status: "error",
      statusMsj: "Ah ocurrido un error inesperado",
      ok: false,
      data: undefined,
    };
  }
  return {
    status: "ok",
    statusMsj: "Data Modificada con exito",
    ok: true,
    data: ArryData,
  };
}
class TicketManager {
  getTicket = async (uid) => {
    const found = await ticketModel
      .findOne({
        id_user_to_ticket: uid,
        isSend: false,
      })
      .lean();
    if (found) {
      return {
        status: "ok",
        statusMsj: "Ticket Encontrado",
        ok: true,
        data: found,
      };
    }
    return {
      status: "error",
      statusMsj: "No se a encontrado el ticket",
      ok: false,
      data: null,
    };
  };

  getSendTicket = async (userID) => {
    const foundSendTicket = await ticketModel
      .find({
        id_user_to_ticket: userID,
        isSend: true,
      })
      .lean();

    if (!foundSendTicket) {
      return {
        status: "error",
        statusMsj: "No se an encontrado los ticket",
        ok: false,
        data: undefined,
      };
    }
    return {
      status: "ok",
      statusMsj: "Se an encotrado todos los ticket",
      ok: true,
      data: foundSendTicket,
    };
  };

  createNewTicket = async (data) => {
    const generarNuevoTicket = await ticketModel.create(data);
  };

  validationSend = async (data) => {
    if (data.isSend) {
      return true;
    }
    return false;
  };

  editTicketShipment = async (userID, address, tipoDeEnvio) => {
    const updateTicket = await ticketModel.findOneAndUpdate(
      {
        id_user_to_ticket: userID,
        isSend: false,
      },
      {
        $set: {
          shippingDestination: address,
          shippingType: tipoDeEnvio,
        },
      },
      { new: true }
    );

    if (!updateTicket) {
      return {
        status: "error",
        statusMsj: "El tiket no fue encontrado",
        ok: false,
        data: null,
      };
    }
    return {
      status: "ok",
      statusMsj: "Meto de envio modificado",
      ok: true,
      data: updateTicket,
    };
  };

  editTicketProducts = async (userID, productsArray, ticketID) => {
    ticketID = "649a0b54d584f1b08e5e2f1b";
    const foundTicket = await this.getTicket(userID);
    if (!foundTicket.ok) {
      console.log("No se encontró el ticket.");
      return foundTicket;
    }

    const ModProductData = modDataProductToTicket(productsArray);
    if (!ModProductData.ok) {
      return ModProductData;
    }

    const { subtotal, taxes, total } = calculatePricesGenerate(
      ModProductData.data
    );

    const updateTicketpurchaseDetails = await ticketModel.findOneAndUpdate(
      {
        id_user_to_ticket: userID,
        isSend: false,
      },
      {
        $set: {
          purchaseDetails: ModProductData.data,
          subtotal,
          taxes,
          total,
        },
      },
      { new: true }
    );

    if (!updateTicketpurchaseDetails) {
      return {
        status: "error",
        statusMsj: "Ha ocurrido un error inisperado",
        ok: false,
        data: undefined,
      };
    }
    return {
      status: "ok",
      statusMsj: "Modificaciones realizadas al ticket con exito",
      ok: true,
      data: undefined,
    };
  };

  editTicketMethodPayment = async (userID, metodoDePago, datosDeTarjeta) => {
    const updateTicket = await ticketModel.findOneAndUpdate(
      {
        id_user_to_ticket: userID,
        isSend: false,
      },
      {
        $set: {
          paymentMethod: metodoDePago,
          cardNumber: datosDeTarjeta,
        },
      },
      { new: true }
    );

    if (!updateTicket) {
      return {
        status: "error",
        statusMsj: "No se acontrado el ticket",
        ok: false,
        data: undefined,
      };
    }
    return {
      status: "ok",
      statusMsj: "Metodo de pago editado",
      ok: true,
      data: updateTicket,
    };
  };

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
      // if (Object.keys(ticketData).length < 7) {
      //   return {
      //     status: "error",
      //     statusMsj:
      //       "No se proporcionó toda la información del ticket. Operación cancelada.",
      //     ok: false,
      //     data: null,
      //     nodata: true,
      //   };
      // }

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
        purchaseDetails: purchaseDetails,
        subtotal,
        taxes,
        total,
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

  cleanTicket = async (userID) => {
    const cleanTicket = await ticketModel.findOneAndUpdate(
      {
        id_user_to_ticket: userID,
        isSend: false,
      },
      {
        $unset: {
          paymentMethod: 1,
          cardNumber: 1,
        },
      },
      { new: true }
    );
  };

  purchaseMade = async (userID) => {
    const purchaseMade = await ticketModel.findOneAndUpdate(
      {
        id_user_to_ticket: userID,
        isSend: false,
      },
      {
        $set: {
          isSend: true,
        },
      },
      { new: true }
    );
    console.log(purchaseMade);
    if (!purchaseMade) {
      return {
        status: "error",
        statusMsj: `Ha ocurrido un error inesperado /n No se a encotrado el ticket`,
        ok: false,
        data: undefined,
      };
    }
    return {
      status: "ok",
      statusMsj: "Gracias por su compra!! /n Vuelva pronto",
      ok: true,
      data: undefined,
    };
  };
}

module.exports = TicketManager;
