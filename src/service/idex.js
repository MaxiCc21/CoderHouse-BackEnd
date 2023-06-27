const HandleProducts = require("../dao/MongoManager/ProductManager");

const productService = new HandleProducts();

module.exports = {
  productService,
};
