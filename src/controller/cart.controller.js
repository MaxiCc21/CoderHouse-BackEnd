const { cartService } = require("../service");

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
}

module.exports = new cartController();
