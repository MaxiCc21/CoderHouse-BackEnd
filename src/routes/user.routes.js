const { Router } = require("express");
const passport = require("passport");
const router = Router();
const { v4: uuidv4 } = require("uuid");

const handleUser = new (require("../UserManager"))();

function idGenerator() {
  return uuidv4();
}

router.get("/", (req, res) => {
  let options = {
    style: "user_Ingresar.css",
  };

  res.render("handleUser.handlebars", options);
});

router.get("/create-user", (req, res) => {
  let options = {
    style: "userCrear.css",
  };

  res.render("user_Create.handlebars", options);
});

router.post("/create-user", async (req, res) => {
  let options = {
    style: "userCrear.css",
  };
  let { body } = req;

  let data = {
    id: idGenerator(),
    ...body,
  };

  let myRes = await handleUser.createNewUser(data);
  console.log(myRes.statusMsj);

  res.render("user_Create.handlebars", options);
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
