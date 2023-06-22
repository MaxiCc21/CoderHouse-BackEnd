const { Router, response, request } = require("express");
const { authToken } = require("../utils/jwt");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const f = require("session-file-store");
const router = Router();
const handleProducts = new (require("../dao/MongoManager/ProductManager"))();

router.get(
  "/",
  // authorizaton("PUBLIC"),
  // passportAuth("jwt"),

  async (req, res) => {
    console.log("/Home");
    let listProducts = await handleProducts.getProducts();

    const jwtUser = req.user ? req.user : false;
    let testUser = {
      products: listProducts,
      style: "home.css",
      usercookie: jwtUser.username ? req.user.username : null,
    };

    res.render("home.handlebars", testUser);
  }
);

router.post("/", (req, res) => {
  res.clearCookie("jwtCoder").redirect("/home");
});

module.exports = router;
