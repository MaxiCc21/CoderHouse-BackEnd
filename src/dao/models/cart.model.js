const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  id_user_to_cart: Schema.Types.ObjectId,
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "productos",
      },
      body: {
        type: Map,
      },

      quantity: Number,
    },
  ],
});

const cartModel = model("carts", cartSchema);
//
module.exports = {
  cartModel,
};
