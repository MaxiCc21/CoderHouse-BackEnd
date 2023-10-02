const { Router, response, request } = require("express");

const { authorizaton } = require("../config/passportAuthorization");
const { passportAuth } = require("../config/passportAuth");
const {
  showSingleProductGET,
  showSingleProductPOST,
  showProductsByCategoryGET,
  APIshowSingleProductGET,
  getProductPaginatorGET,
  productDELETE,
  productAddPOST,
  createProductPOST,

  productGET,
} = require("../controller/product.controller");

const { productService } = require("../service");
const router = Router();

router.get("/", productGET);

router.post("/createproduct", createProductPOST);

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

router.delete(
  "/:pid",
  passportAuth("jwt"),
  authorizaton("user"),
  productDELETE
);

router.post("/", passportAuth("jwt"), authorizaton("user"), productAddPOST);

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
  const updateProduct = await productService.updateProduct(pid, newData);
  response.status(updateProduct.status).send(updateProduct);
});

router.post("/", async (request, response) => {
  const newProduct = request.body;

  let res = await productService.addProduct(newProduct);

  console.log("Este?");

  response.send(res);
});

router.get(
  "/products/admin/gggg?page=1",
  passportAuth("jwt"),
  authorizaton("admin"),
  getProductPaginatorGET
);

module.exports = router;
