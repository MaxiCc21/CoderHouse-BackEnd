const { Router, response, request } = require("express");
const router = Router();
const handleProducts = new (require("../dao/MongoManager/ProductManager"))();
const { v4: uuidv4 } = require("uuid");
const { createHashhhh } = require("../utils/bcryptHas");
const passport = require("passport");
const { generateToke } = require("../utils/jwt");

const handleUser = new (require("../dao/MongoManager/UserManager"))();

router.get("/", async (require, res) => {
  let listProducts = await handleProducts.getProducts();

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
  passport.authenticate("login", { failureRedirect: "login" }),
  function (req, res) {
    const data = req.user;
    console.log(req.message, "??????????");
    const newUser = {
      sub: data._id,
      username: data.username,
      role: "user",
      email: data.email,
      isAdmin: data.isAdmin,
    };
    const token = generateToke(newUser);
    res
      .cookie("jwtCoder", token, {
        maxAge: 100000,
        httpOnly: true,
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

module.exports = router;

// -------------------------------
// const { Router, response, request } = require("express");
// const router = Router();
// const handleProducts = new (require("../dao/MongoManager/ProductManager"))();
// const { v4: uuidv4 } = require("uuid");
// const { createHashhhh } = require("../utils/bcryptHas");
// const passport = require("passport");
// const { generateToke } = require("../utils/jwt");
// const jwt = require("jsonwebtoken");

// const handleUser = new (require("../dao/MongoManager/UserManager"))();

// router.get("/", async (require, res) => {
//   let listProducts = await handleProducts.getProducts();
//   console.log(listProducts);
//   let testUser = {
//     products: listProducts,
//     style: "home.css",
//   };

//   res.render("home.handlebars", testUser);
// });

// router.get("/login", async (req, res) => {
//   let options = {
//     style: "user_Ingresar.css",
//   };

//   res.render("users/userLogin", options);
// });

// router.post(
//   "/login",
//   passport.authenticate("login", {
//     failureRedirect: "login",
//     // successRedirect: "/home",
//   }),
//   function (req, res) {
//     const data = req.user;

//     console.log(data, "PPPPPPPPPPPPPPPPPPPPPP");

//     const accessToken = generateToke({
//       sub: data._id,
//       username: data.username,
//       email: data.email,
//       isAdmin: data.isAdmin,
//     });
//     req.headers.authorization = accessToken;

//     console.log(req.authorization);

//     // res.header("Authorization", `Bearer ${accessToken}`).redirect("/home");
//     res
//       .cookie("username", data.username, {
//         maxAge: 100000,
//       })
//       .cookie("isAdmin", data.isAdmin, {
//         maxAge: 100000,
//       })
//       .redirect("/home");
//   }
// );

// router.get("/failLogin", (req, res) => {
//   res.send("Mal login");
// });

// // ----------------------------------------------------------
// router.get("/register", async (req, res) => {
//   let options = {
//     style: "userCrear.css",
//     title: "Mercado-Libre | Usuario",
//   };

//   res.render("users/userRegister.handlebars", options);
// });

// router.post(
//   "/register",
//   passport.authenticate("register", {
//     failureRedirect: "login",
//     successRedirect: "login",
//   }),
//   function (req, res) {
//     console.log(req.newUser);
//     console.log(req);
//     res.redirect("/login");
//   }
// );

// router.get("/failregister", (req, res) => {
//   console.log("ERRRRRRRRRRR");
//   res.send({ status: "err", statusMsj: "Fallo autenticate" });
// });

// router.get("/product/:pid", async (req, res) => {
//   const pid = req.params.pid;

//   const product = await handleProducts.getProductById(pid);
//   const options = {
//     style: "productShow.css",
//     product: product[0],
//   };
//   console.log(product);
//   if (!product) {
//     response.send({
//       error: `No se a econtrado nungun producto con id(${pid})`,
//     });
//   } else {
//     res.render("products/product_show.handlebars", options);
//   }
// });

// module.exports = router;
