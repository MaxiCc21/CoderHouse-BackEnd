const { productService } = require("../service");

class UserController {
  loadProduct = async (req, res) => {
    console.log("/Home");
    let listProducts = await productService.getAllProducts();
    console.log(typeof listProducts);
    const jwtUser = req.user ? req.user : false;
    console.log(jwtUser);
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
