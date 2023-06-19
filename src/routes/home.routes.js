const { Router, response, request } = require("express");
const { authToken } = require("../utils/jwt");
const { passportAuth } = require("../config/passportAuth");
const router = Router();
const handleProducts = new (require("../dao/MongoManager/ProductManager"))();

const logger = function (req, res, next) {
  const jwtCookie = console.log("logging");
  authToken(jwtCookie);
  next();
};

router.get("/", passportAuth("jwt"), async (req, res) => {
  console.log("/Home");

  let listProducts = await handleProducts.getProducts();

  let testUser = {
    products: listProducts,
    style: "home.css",
    usercookie: req.user.user.username,
  };

  res.render("home.handlebars", testUser);
});

router.post("/", (req, res) => {
  res.clearCookie("username").redirect("home");
});

router.get("/h", (req, res) => {
  const token = req.cookies["jwtCoder"];
  res.send(token);
});

module.exports = router;
