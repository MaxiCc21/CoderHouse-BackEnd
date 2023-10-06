const { productModel } = require("../dao/models/product.model");
const { logger } = require("../middlewares/logger");
const { productService } = require("../service");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

class UserController {
  loadProduct = async (req, res) => {
    logger.info("/Home");
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
        const jsonFilePath = path.resolve(
          __dirname,
          "../../MercadoLibre.products.json"
        );
        const jsonData = fs.readFileSync(jsonFilePath, "utf8");
        const productsFromJson = JSON.parse(jsonData);
        await productModel.insertMany(productsFromJson);
        console.log("Datos importados desde MercadoLibre.products.json.");
        window.location.reload();
      } else {
        console.log("listProducts NO está vacío, no se importaron datos.");
      }

      let options = {
        products: listProducts,
        style: "home.css",
        usercookie: JWTuser,
      };

      res.render("home.handlebars", options);
    }
  };

  logOutUser = (req, res) => {
    res.clearCookie("jwtCoder").redirect("/home");
  };
}

module.exports = new UserController();
