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

router.get("/register", async (req, res) => {
  let options = {
    style: "userCrear.css",
    title: "Mercado-Libre | Usuario",
  };

  res.render("users/userRegister.handlebars", options);
});

router.post("/register", async (req, res) => {
  console.log("Entro????????????");
  let options = {
    style: "userCrear.css",
  };
  let {
    firstname,
    lastname,
    fullname,
    username,
    email,
    password,
    isAdmin,
    adress,
  } = req.body;

  let data = {
    firstname,
    lastname,
    fullname,
    username,
    email,
    password,
    isAdmin,
    adress,
  };
  console.log(data);

  let myRes = await handleUser.createNewUser(data);
  console.log(myRes.statusMsj);

  res.render("home", options);
});

module.exports = router;
