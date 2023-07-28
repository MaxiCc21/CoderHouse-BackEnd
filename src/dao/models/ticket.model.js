const { Schema, model } = require("mongoose");

const TicketSchema = new Schema({
  id_user_to_ticket: Schema.Types.ObjectId,

  receiptNumber: {
    type: String,
    required: true,
    unique: true,
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
    },
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  taxes: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
  },
  shippingDestination: {
    type: String,
    required: true,
    default: "---",
  },
  shippingType: {
    type: String,
    required: true,
    default: "---",
  },
  isSend: {
    type: Boolean,
    default: false,
  },
});

const ticketModel = model("ticket", TicketSchema);

module.exports = { ticketModel };