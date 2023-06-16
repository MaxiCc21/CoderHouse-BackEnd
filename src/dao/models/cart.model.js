const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "productos",
      },
    },
  ],
});

const cartModel = model("carts", cartSchema);
//
module.exports = {
  cartModel,
};
