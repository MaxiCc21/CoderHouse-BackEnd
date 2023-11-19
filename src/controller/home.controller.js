const { logger } = require("../middlewares/logger");
const { productService } = require("../service");

class UserController {
  loadProduct = async (req, res) => {
    logger.info("/Home");
    let paymentStatusMessage;
    switch (req.query.status) {
      case "rejected":
        paymentStatusMessage = `Ocurrio un Error al realizar el pago`;
        break;

      case "approved":
        paymentStatusMessage = `Gracias pro comprar con nosotros`;
        break;
      case "pending":
        paymentStatusMessage = `La compra esta en modo pendiente, Verifica con tu proveedor de pago`;
        break;

      default:
        break;
    }

    const JWTuser = req.user ? req.user : false;
    if (JWTuser.role === "admin") {
      let options = {
        style: "adminHome.css",
        usercookie: JWTuser,
      };
      res.render("admin/home.admin.handlebars", options);
    } else {
      let listProducts = await productService.getAllProducts();

      let options = {
        products: listProducts,
        style: "home.css",
        usercookie: JWTuser,
        paymentStatusMessage,
      };

      res.render("home", options);
    }
  };

  logOutUser = (req, res) => {
    res.clearCookie("jwtCoder").redirect("/home");
  };
}

module.exports = new UserController();
