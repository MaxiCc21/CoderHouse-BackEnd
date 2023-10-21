const { Router } = require("express");
const passport = require("passport");
const router = Router();
const { v4: uuidv4 } = require("uuid");
const {
  loginGET,
  loginPOST,
  registerGET,
  registerPOST,
  recoverGET,
  recoverPOST,
  modifyGET,
  modifyPOST,

  getUserByIDGET,
  getPaginate,

  adminUserEditGET,
  adminUserEditPOST,

  adminUserCreateNewUserGET,
  adminUserCreateNewUserPOST,

  allUsersGET,
  misComprasGET,
  paginateGET,
  githubGET,
  githubcallbackGET,
  deleteUserDELETE,
  updateUserPUT,
  premiumGET,
  premiumPOST,
} = require("../controller/user.controller");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");

//localhost:8080/session
router.get("/", allUsersGET);

//localhost:8080/session/updateuser/6461c87748c1be7bd066bc2f
// {
// "firstname":"Prueba"
// }

router.put("/updateuser/:uid", updateUserPUT);

//localhost:8080/session/deleteuser/:uid
router.delete("/deleteuser/:uid", deleteUserDELETE);

//http://localhost:8080/session/register
// {
//   "firstname": "asdfsadfsdf",
//   "lastname": "prueba ",
//   "username": "prueba3",
//   "email": "prueba5@weirby.com",
//   "password": "Pass1234",
//   "address": "sadfsdaf"
// }
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/session/register" }),
  registerPOST
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  githubGET
);
router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/views/register",
  }),
  githubcallbackGET
);

router.get(
  "/miscompras",
  passportAuth("jwt"),
  authorizaton("user"),
  misComprasGET
);

router.get("/paginate", paginateGET);

// ---------------------------
router.get("/login", loginGET);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/session/login" }),
  loginPOST
);

router.get("/failLogin", (req, res) => {
  res.send("Mal login");
});

router.get("/register", registerGET);

router.get("/recover-password", recoverGET);

router.post("/recover-password", recoverPOST);

router.get("/modify-password", modifyGET);

router.post("/modify-password", modifyPOST);

router.get("/premium", passportAuth("jwt"), authorizaton("user"), premiumGET);

router.post("/premium", passportAuth("jwt"), authorizaton("user"), premiumPOST);

// --------------Admin Routes-------------

router.get("/admin/userEdit/:uid", adminUserEditGET);

router.post(
  "/admin/userEdit/:uid",
  passportAuth("jwt"),
  authorizaton("admin"),
  adminUserEditPOST
);

router.get(
  "/admin/createNewUser",
  passportAuth("jwt"),
  authorizaton("admin"),
  adminUserCreateNewUserGET
);
router.post(
  "/admin/createNewUser",
  passportAuth("jwt"),
  authorizaton("admin"),
  adminUserCreateNewUserPOST
);

router.get(
  "/admin/users?:limit",
  passportAuth("jwt"),
  authorizaton("admin"),
  getPaginate
);

// --------------Admin Routes-------------

router.get("/:uid", getUserByIDGET);

module.exports = router;
