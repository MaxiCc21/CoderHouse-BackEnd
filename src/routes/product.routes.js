const { Router, response, request } = require("express");
const { authToken } = require("../utils/jwt");
const { authorizaton } = require("../config/passportAuthorization");
const { passportAuth } = require("../config/passportAuth");
const {
  showSingleProductGET,
  showSingleProductPOST,
  showProductsByCategoryGET,
  APIshowSingleProductGET,
} = require("../controller/product.controller");
const { productService } = require("../service");
const router = Router();
const handleProducts = new (require("../dao/MongoManager/ProductManager"))();
const handleCart = new (require("../dao/MongoManager/CartManager"))();

router.get("/", async (request, response) => {
  let res = await handleProducts.getAllProducts();
  let { limit } = request.query;
  if (limit) {
    res = res.slice(0, limit);
  }
  response.send(res);
});

router.get(
  "/:pid",
  passportAuth("jwt"),
  authorizaton("PUBLIC"),
  showSingleProductGET
);

router.post(
  "/:pid",
  passportAuth("jwt"),
  authorizaton("user"),
  showSingleProductPOST
);

router.delete("/:pid", async (req, res) => {
  let { pid } = req.params;

  let deleteProduct = await handleProducts.deleteProductByID(pid);
  console.log(deleteProduct);
  res.status(deleteProduct.status).send(deleteProduct);
});

router.post("/", async (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  let agregarProducto = await handleProducts.addProduct(newProduct);

  res.status(agregarProducto.status).send(agregarProducto);
});

router.get(
  "/categoria/:pc",
  passportAuth("jwt"),
  authorizaton("PUBLIC"),
  showProductsByCategoryGET
);

// ------------API-------------
router.get(
  "/api/:pid",
  passportAuth("jwt"),
  authorizaton("PUBLIC"),
  APIshowSingleProductGET
);

router.put("/:pid", async (request, response) => {
  const { pid } = request.params;
  const newData = request.body;
  const updateProduct = await handleProducts.updateProduct(pid, newData);
  response.status(updateProduct.status).send(updateProduct);
});

router.post("/", async (request, response) => {
  const newProduct = request.body;

  let res = await handleProducts.addProduct(newProduct);
  console.log(res, "rs");

  if (res.status) {
  }

  response.send(res);
});

module.exports = router;
