const { Router, response, request } = require("express");
const router = Router();
const handleProducts = new (require("../dao/MongoManager/ProductManager"))();
const { v4: uuidv4 } = require("uuid");
const { createHashhhh } = require("../utils/bcryptHas");
const passport = require("passport");

const handleUser = new (require("../dao/MongoManager/UserManager"))();

router.get("/", async (require, res) => {
  let listProducts = await handleProducts.getProducts();
  console.log(listProducts);
  let testUser = {
    products: listProducts,
    style: "home.css",
  };

  res.render("home.handlebars", testUser);
});

router.get("/login", async (req, res) => {
  let data = await handleUser.getAllUser();
  let options = {
    style: "user_Ingresar.css",
    data,
  };

  res.render("users/userLogin", options);
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "login" }),
  function (req, res) {
    const data = req.user;

    console.log(data, "??????????");
    res
      .cookie("username", data.username, {
        maxAge: 100000,
      })
      .cookie("isAdmin", data.isAdmin, {
        maxAge: 100000,
      })
      .redirect("/home");
  }
);

router.get("/failLogin", (req, res) => {
  res.send("Mal login");
});

// ----------------------------------------------------------
router.get("/register", async (req, res) => {
  let options = {
    style: "userCrear.css",
    title: "Mercado-Libre | Usuario",
  };

  res.render("users/userRegister.handlebars", options);
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "login",
    successRedirect: "login",
  }),
  function (req, res) {
    console.log(req.newUser);
    console.log(req);
    res.redirect("/login");
  }
);

router.get("/failregister", (req, res) => {
  console.log("ERRRRRRRRRRR");
  res.send({ status: "err", statusMsj: "Fallo autenticate" });
});

module.exports = router;
