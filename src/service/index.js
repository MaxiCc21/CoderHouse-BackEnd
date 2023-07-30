const HandleProducts = require("../dao/MongoManager/ProductManager");
const handleCart = require("../dao/MongoManager/CartManager");
const TicketManager = require("../dao/MongoManager/ticketManager");

const productService = new HandleProducts();
const cartService = new handleCart();
const ticketService = new TicketManager();

module.exports = {
  productService,
  cartService,
  ticketService,
};
