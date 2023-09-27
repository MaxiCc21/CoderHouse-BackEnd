const { Schema, model } = require("mongoose");

const TicketSchema = new Schema({
  id_user_to_ticket: Schema.Types.ObjectId,

  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  purchaseDetails: [
    {
      product: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unitPrice: {
        type: Number,
        required: true,
      },
      mainImg: {
        type: String,
        required: true,
      },
    },
  ],
  subtotal: {
    type: Number,
    default: 0,
  },
  taxes: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
    required: true,
    default: "---",
  },
  cardNumber: {
    type: String,
    default: "---",
  },
  shippingDestination: {
    type: String,
    default: "---",
  },
  shippingType: {
    type: String,
    default: "---",
  },
  isSend: {
    type: Boolean,
    default: false,
  },
  shippingDestination: {
    type: String,
    default: "---",
  },
  merchantOrder: {
    type: String,
    default: "---",
  },
  isSend: {
    type: Boolean,
    default: false,
  },
});

const ticketModel = model("ticket", TicketSchema);

module.exports = { ticketModel };
