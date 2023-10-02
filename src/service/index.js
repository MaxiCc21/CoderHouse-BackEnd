const HandleProducts = require("../dao/MongoManager/ProductManager");
const handleCart = require("../dao/MongoManager/CartManager");
const TicketManager = require("../dao/MongoManager/ticketManager");
const userManager = require("../dao/MongoManager/UserManager");
const chatManager = require("../dao/MongoManager/ChatManager");

const productService = new HandleProducts();
const cartService = new handleCart();
const ticketService = new TicketManager();
const userService = new userManager();
const chatService = new chatManager();

module.exports = {
  productService,
  cartService,
  ticketService,
  userService,
  chatService,
};
