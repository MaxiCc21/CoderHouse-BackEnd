const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  category: Array,
  marca: String,
  stock: Number,
  createTime: { type: Date, default: Date.now },
  rating: Number,
});

const productModel = model("products", ProductSchema);

module.exports = {
  productModel,
};
