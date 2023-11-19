const { productModel } = require("../dao/models/product.model");
const { logger } = require("../middlewares/logger");
const { productService } = require("../service");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { userModel } = require("../dao/models/user.model");

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

      if (listProducts.length === 0) {
        const productJsonFilePath = path.resolve(
          __dirname,
          "../../MercadoLibre.products.json"
        );
        const userJsonFilePath = path.resolve(
          __dirname,
          "../../MercadoLibre.users.json"
        );
        const userJsonData = fs.readFileSync(userJsonFilePath, "utf8");
        const productJsonData = fs.readFileSync(productJsonFilePath, "utf8");
        const productsFromJson = JSON.parse(productJsonData);
        const userFromJson = JSON.parse(userJsonData);
        await productModel.insertMany(productsFromJson);
        await userModel.insertMany(userFromJson);
        logger.info("Datos importados desde MercadoLibre.products.json.");
      } else {
        logger.info("listProducts NO está vacío, no se importaron datos.");
      }

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
