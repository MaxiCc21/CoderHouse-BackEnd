const { Router } = require("express");
const router = Router();
const handleProducts = new (require("../dao/MongoManager/ProductManager"))();
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");

const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const {
  loginGET,
  loginPOST,
  registerGET,
} = require("../controller/user.controller");

router.get("/", async (require, res) => {
  let listProducts = await handleProducts.getProducts();

  let testUser = {
    products: listProducts,
    style: "home.css",
  };

  res.render("home.handlebars", testUser);
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  loginPOST
);

router.get("/failLogin", (req, res) => {
  res.send("Mal login");
});

// ----------------------------------------------------------
router.get("/register", registerGET);

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "login",
    successRedirect: "login",
  }),
  function (req, res) {
    res.redirect("/login");
  }
);

router.get("/failregister", (req, res) => {
  res.send({ status: "err", statusMsj: "Fallo autenticate" });
});

router.get(
  "/misCompras",
  passportAuth("jwt"),
  authorizaton("user"),

  (req, res) => {
    res.send({ status: "ok", statusMsj: "MisCompras" });
  }
);

module.exports = router;
