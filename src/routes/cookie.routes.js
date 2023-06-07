const { Router } = require("express");
const { get } = require("mongoose");
const router = Router();

router.get("/setCookie", (req, res) => {
  res
    .cookie("UserCookie", "Esta es una cookie muy poderosa", {
      maxAge: 100000,
    })
    .send("Cookie seteada");
});

router.get("/getCookie", (req, res) => {
  res.send(req.cookies);
});

router.get("/deleteCookie", (req, res) => {
  res.clearCookie("UserCookie").send("Chau galletita");
});

router.get("/setSignedCookie", (req, res) => {
  res
    .cookie("UserSignedCookie", "Maxi", {
      maxAge: 1000000,
      signed: true,
    })
    .send("Cookie seteada");
});
router.get("/getSignedCookie", (req, res) => {
  res.send(req.signedCookies);
});

router.get("/", (req, res) => {
  let data = "Hola";
  const options = {
    data,
  };
  res.render("cookieHandler", options);
});

router.post("/", function (req, res) {
  const { username, email } = req.body;

  res
    .cookie(username, email, {
      maxAge: 1000000,
      signed: true,
    })
    .send(req.signedCookies);
});

router.get("/session", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`has entrado ${req.session.counter} veces`);
  } else {
    req.session.counter = 1;
    res.send("Bienvenido");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({ status: "error", error: err });
    }
  });
  res.send("Chau");
});

module.exports = router;
