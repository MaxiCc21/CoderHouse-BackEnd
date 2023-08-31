const HandleProducts = require("../dao/MongoManager/ProductManager");
const handleCart = require("../dao/MongoManager/CartManager");
const TicketManager = require("../dao/MongoManager/ticketManager");
const userManager = require("../dao/MongoManager/UserManager");

const productService = new HandleProducts();
const cartService = new handleCart();
const ticketService = new TicketManager();
const userService = new userManager();

module.exports = {
  productService,
  cartService,
  ticketService,
  userService,
};
