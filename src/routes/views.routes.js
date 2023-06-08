const { Router, response, request } = require("express");
const router = Router();
const handleProducts = new (require("../dao/MongoManager/ProductManager"))();
const { v4: uuidv4 } = require("uuid");

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

router.post("/login", async (req, res) => {
  const { identification, password } = req.body;

  let data = await handleUser.loginValidation(identification, password);
  if (data.status === "ok") {
    console.log(data.statusMsj);
    res
      .cookie("username", data.username, {
        maxAge: 100000,
      })
      .redirect("/home");
  }
});

// ----------------------------------------------------------
router.get("/register", async (req, res) => {
  let options = {
    style: "userCrear.css",
    title: "Mercado-Libre | Usuario",
  };

  res.render("users/userRegister.handlebars", options);
});

router.post("/register", async (req, res) => {
  let data = {
    ...req.body,
  };

  let myRes = await handleUser.createNewUser(data);
  console.log(myRes.statusMsj);

  res
    .cookie("username", data.username, {
      maxAge: 100000,
    })
    .cookie("isAdmin", data.isAdmin, {
      maxAge: 100000,
    })
    .redirect("/home");
});
module.exports = router;
