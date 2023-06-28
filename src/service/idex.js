const HandleProducts = require("../dao/MongoManager/ProductManager");
const handleCart = require("../dao/MongoManager/CartManager");

const productService = new HandleProducts();
const cartService = new handleCart();

module.exports = {
  productService,
  cartService,
};
