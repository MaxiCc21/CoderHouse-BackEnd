const { Router, response, request } = require("express");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");

const { loadProduct, logOutUser } = require("../controller/home.controller");


const router = Router();


router.get("/", passportAuth("jwt"), authorizaton("PUBLIC"), loadProduct);

router.post("/", logOutUser);

module.exports = router;
