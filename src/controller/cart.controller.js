const { cartService, ticketService } = require("../service");

class cartController {
  cartGET = async (req, res) => {
    console.log("/api/carts");
    const jwtUser = req.user;

    const productDataUser = await cartService.getItemToCart(jwtUser.sub);
    if (!productDataUser.ok) {
      res.status(400).send("Algo salio mal al cargar los productos");
    }
    console.log(productDataUser.data);
    console.log(productDataUser.statusMsj);
    const options = {
      title: "Carrito de compras",
      style: "cart.css",
      products: productDataUser.data,
      usercookie: jwtUser,
    };

    res.render("cart/cart.handlebars", options);
  };
  cartPOST = async (req, res) => {
    const jwtUser = req.user;
    const { userID } = req.body;
    const foundCart = await cartService.getItemToCart(userID);
    if (!foundCart.ok) {
      return res.status(400).send(foundCart.statusMsj);
    }

    const addProductsTicket = await ticketService.editTicketProducts(
      jwtUser.sub,
      foundCart.data
    );

    if (!addProductsTicket.ok) {
      res.status(400).send(addProductsTicket.statusMsj);
    } else {
      res.redirect("/comprar");
    }
  };
}

module.exports = new cartController();
