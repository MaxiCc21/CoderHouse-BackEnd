const { Router } = require("express");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const {
  myProductsGET,
  createProductGET,
  createProductPOST,
  publicarGET,
  editMyProductGET,
  editMyProductPOST,
} = require("../controller/publicar.controller");

const router = Router();

router.get("/", passportAuth("jwt"), authorizaton("user"), publicarGET);

router.get(
  "/myproducts",
  passportAuth("jwt"),
  authorizaton("premium"),
  myProductsGET
);

router.get(
  "/createproduct",
  passportAuth("jwt"),
  authorizaton("premium"),
  createProductGET
);

router.post(
  "/createproduct",
  passportAuth("jwt"),
  authorizaton("premium"),
  createProductPOST
);

router.get(
  "/editmyproducts/:pid",
  passportAuth("jwt"),
  authorizaton("premium"),
  editMyProductGET
);
router.post(
  "/editmyproducts/:pid",
  passportAuth("jwt"),
  authorizaton("premium"),
  editMyProductPOST
);

module.exports = router;
