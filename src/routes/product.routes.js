const { Router, response, request } = require("express");
const { authToken } = require("../utils/jwt");
const { authorizaton } = require("../config/passportAuthorization");
const { passportAuth } = require("../config/passportAuth");
const {
  showSingleProductGET,
  showSingleProductPOST,
  showProductsByCategoryGET,
  APIshowSingleProductGET,
  getProductPaginator,
  getProductPaginatorGET,
} = require("../controller/product.controller");
const { productService } = require("../service");
const router = Router();

router.get("/", async (request, response) => {
  let res = await productService.getAllProducts();
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

  let deleteProduct = await productService.deleteProductByID(pid);

  res.status(deleteProduct.status).send(deleteProduct);
});

router.post("/", async (req, res) => {
  const newProduct = req.body;

  let agregarProducto = await productService.addProduct(newProduct);

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
  const updateProduct = await productService.updateProduct(pid, newData);
  response.status(updateProduct.status).send(updateProduct);
});

router.post("/", async (request, response) => {
  const newProduct = request.body;

  let res = await productService.addProduct(newProduct);

  if (res.status) {
  }

  response.send(res);
});

router.get(
  "/products/admin/gggg?page=1",
  passportAuth("jwt"),
  authorizaton("admin"),
  getProductPaginatorGET
);

module.exports = router;
