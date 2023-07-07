const { productService } = require("../service/idex");

class UserController {
  loadProduct = async (req, res) => {
    console.log("/Home");
    let listProducts = await productService.getProducts();

    const jwtUser = req.user ? req.user : false;
    let testUser = {
      products: listProducts,
      style: "home.css",
      usercookie: jwtUser,
    };

    res.render("home.handlebars", testUser);
  };

  logOutUser = (req, res) => {
    res.clearCookie("jwtCoder").redirect("/home");
  };
}

module.exports = new UserController();
