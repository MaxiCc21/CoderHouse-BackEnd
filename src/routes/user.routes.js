const { Router } = require("express");
const passport = require("passport");
const router = Router();
const { v4: uuidv4 } = require("uuid");
const {
  loginGET,
  loginPOST,
  registerGET,
  registerPOST,
} = require("../controller/user.controller");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const { ticketService } = require("../service");

const handleUser = new (require("../dao/MongoManager/UserManager"))();

function idGenerator() {
  return uuidv4();
}

// router.get("/", (req, res) => {
//   let options = {
//     style: "user_Ingresar.css",
//   };

//   res.render("handleUser.handlebars", options);
// });

router.get(
  "/miscompras",
  passportAuth("jwt"),
  authorizaton("user"),
  async (req, res) => {
    const jwtUser = req.user;
    const foundSendTicket = await ticketService.getSendTicket(jwtUser.sub);

    const options = {
      style: "misCompras.css",
      data: foundSendTicket.data,
      usercookie: jwtUser,
    };
    console.log(foundSendTicket.data);
    if (!foundSendTicket.ok) {
      res.status(400).send(foundSendTicket.statusMsj);
    } else {
      res.render("shopping/misCompras", options);
    }
  }
);

router.get("/paginate", async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  let data = await handleUser.getAllUserPaginate(page, limit);
  console.log(data);
  const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = data;
  let options = {
    style: "showUser_paginate.css",
    users: docs,
    page,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    disabled: "disabled",
  };

  res.render("showUser_paginate.handlebars", options);
});

router.get("/", async (req, res) => {
  let data = await handleUser.getAllUser();
  let options = {
    style: "user_Ingresar.css",
    data,
  };

  res.send(options.data);
});

router.get("/create-user", async (req, res) => {
  let options = {
    style: "userCrear.css",
    title: "Mercado-Libre | Usuario",
  };

  res.render("user_Create.handlebars", options);
});

//localhost:8080/handleUser/createuser
// {
//   "firstname": "Prueba",
//   "lastname": "Prueba",
//   "username": "Prueba21",
//   "email": "prueba123@gmail.com",
//   "password": "Hola21498",
//   "isAdmin": false,
//   "adress": "Salta 1234",
//   "lastUpdate": {
//     "$date": "2023-05-11T18:12:58.841Z"
//   },
//   "__v": 0
// }
http: router.post("/createuser", async (req, res) => {
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
    mail: email,
    password,
    isAdmin,
    adress,
  };

  let myRes = await handleUser.createNewUser(data);
  console.log(myRes.statusMsj);

  res.render("home", options);
});

//localhost:8080/handleUser/updateuser/6461c87748c1be7bd066bc2f
// {
// "firstname":"Prueba"
// }
http: router.put("/updateuser/:pid", async (req, res) => {
  let pid = req.params.pid;
  let bodyData = req.body;

  let myRes = await handleUser.updateUser(pid, bodyData);

  if (!myRes) {
    res.send("Se an realizado los cambios correctamente");
  } else {
    res.send("A ocurrido un erro");
  }
});

//localhost:8080/handleUser/deleteuser/6461c87748c1be7bd066bc2f
http: router.delete("/deleteuser/:pid", async (req, res) => {
  let pid = req.params.pid;

  let myRes = await handleUser.deletUser(pid);
  if (!myRes) {
    console.log("Objeto eliminado exitosamento");
  } else {
    res.send("A ocurrido un error al eliminar el objeto");
  }
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {
    res.send("GET request to the homepage");
  }
);
router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/views/register",
  }),
  async (req, res) => {
    req.session.user = req.user;

    res.redirect("/home");
  }
);
module.exports = router;

// ---------------------------
router.get("/login", loginGET);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  loginPOST
);

router.get("/failLogin", (req, res) => {
  res.send("Mal login");
});

router.get("/register", registerGET);

router.post("/register", passport.authenticate("register"), registerPOST);

// {
//   failureRedirect: "login",
//   successRedirect: "login",
// }

router.get("/failregister", (req, res) => {
  console.log("ERRRRRRRRRRR");
  res.send({ status: "err", statusMsj: "Fallo autenticate" });
});
