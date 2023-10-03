const { logger } = require("../middlewares/logger");
const { productService } = require("../service");

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
