const { Router, response, request } = require("express");
const router = Router();
const handleProducts = new (require("../dao/MongoManager/ProductManager"))();
const { v4: uuidv4 } = require("uuid");
const { createHashhhh } = require("../utils/bcryptHas");
const passport = require("passport");
const { generateToke } = require("../utils/jwt");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const { loginGET, loginPOST } = require("../controller/user.controller");

const handleUser = new (require("../dao/MongoManager/UserManager"))();
const handleCart = new (require("../dao/MongoManager/CartManager"))();

router.get("/", async (require, res) => {
  let listProducts = await handleProducts.getProducts();

  let testUser = {
    products: listProducts,
    style: "home.css",
  };

  res.render("home.handlebars", testUser);
});

router.get("/login", loginGET);

// router.post("/login", async (req, res) => {
//   const { identification, password } = req.body;
//   let data = await handleUser.loginValidation(identification, password);
//   if (data.status === "ok") {
//     res
//       .cookie("username", data.username, {
//         maxAge: 100000,
//       })
//       .redirect("/home");
//   } else {
//     res.status(401).redirect("/views/login");
//   }
// });

// router.post(
//   "/login",
//   passport.authenticate("login", {
//     failureRedirect: "login",
//     successRedirect: "home",
//   })
// );

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  loginPOST

  // async function (req, res) {
  //   console.log(req.user, "/login");
  //   console.log("/login");
  //   const data = req.user;

  //   const newUser = {
  //     sub: data._id,
  //     username: data.username,
  //     role: "user",
  //     email: data.email,
  //     address: data.address,
  //     isAdmin: data.isAdmin,
  //   };
  //   const token = generateToke(newUser);
  //   try {
  //     const crearCarrito = await handleCart.createNewCart(data._id);
  //     console.log(crearCarrito.statusMsj);
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   res
  //     .cookie("jwtCoder", token, {
  //       maxAge: 100000 * 60,
  //       httpOnly: true,
  //     })
  //     .redirect("/home");
  // }
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

// router.post("/register", async (req, res) => {
//   let data = {
//     ...req.body,
//     password: createHashhhh(req.body.password),
//   };

//   let myRes = await handleUser.createNewUser(data);
//   console.log(myRes.statusMsj);

//   res
//     .cookie("username", data.username, {
//       maxAge: 100000,
//     })
//     .cookie("isAdmin", data.isAdmin, {
//       maxAge: 100000,
//     })
//     .redirect("/home");
// });
// module.exports = router;

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

router.get(
  "/misCompras",
  passportAuth("jwt"),
  authorizaton("user"),

  (req, res) => {
    res.send({ status: "ok", statusMsj: "MisCompras" });
  }
);

module.exports = router;
