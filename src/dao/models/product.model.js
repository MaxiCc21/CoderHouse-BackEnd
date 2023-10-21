const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  category: Array,
  marca: { type: String, required: true },
  stock: { type: Number, required: true },
  owner: {
    ownerID: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    ownerUsername: {
      type: String,
      default: "owner",
      ref: "users",
    },
  },
  createTime: { type: Date, default: Date.now },
  estado: {
    type: String,
    enum: ["on", "off", "pause"],
    default: "on",
  },
  rating: Number,
});

const productModel = model("products", ProductSchema);

module.exports = {
  productModel,
};
