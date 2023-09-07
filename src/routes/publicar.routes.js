const { Router } = require("express");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const { userService, productService } = require("../service");

const router = Router();

router.get("/", passportAuth("jwt"), authorizaton("user"), async (req, res) => {
  const JWTuser = req.user;

  const options = {
    style: "yourProduct.css",
    usercookie: JWTuser,
  };

  res.render("publicar/yourProduct", options);
});

router.get(
  "/myproducts",
  passportAuth("jwt"),
  authorizaton("premium"),
  async (req, res) => {
    const JWTuser = req.user;
    let uid = JWTuser.sub;

    const myproducts = await productService.getProductByUserID(uid);

    const options = {
      style: "showMyProducts.css",
      data: myproducts.data,
      usercookie: JWTuser,
    };

    res.render("publicar/showMyProducts", options);
  }
);

router.get(
  "/createproduct",
  passportAuth("jwt"),
  authorizaton("premium"),
  (req, res) => {
    const JWTuser = req.user;
    const options = {
      style: "createOwnProduct.css",
      usercookie: JWTuser,
    };

    res.render("publicar/createOwnProduct", options);
  }
);

router.post(
  "/createproduct",
  passportAuth("jwt"),
  authorizaton("premium"),
  async (req, res) => {
    let dataNewProduct = req.body;

    dataNewProduct = {
      ...dataNewProduct,
      owner: {
        ownerID: req.body.ownerID,
        ownerUsername: req.body.ownerUsername,
      },
    };
    delete dataNewProduct.ownerID;
    delete dataNewProduct.ownerUsername;
    const createNewProduct = await productService.createProduct(dataNewProduct);

    res.send(createNewProduct);
  }
);

module.exports = router;
