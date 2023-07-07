const { Schema, model } = require("mongoose");

const TicketSchema = new mongoose.Schema({
  numeroRecibo: {
    type: String,
    required: true,
    unique: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  detallesCompra: [
    {
      producto: {
        type: String,
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
      precioUnitario: {
        type: Number,
        required: true,
      },
    },
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  impuestos: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  metodoPago: {
    type: String,
    required: true,
  },
  numeroTarjeta: {
    type: String,
  },
});

const ticketModel = model("ticket", TicketSchema);

module.exports = { ticketModel };
