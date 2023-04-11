const { Router, response, request } = require("express");
const router = Router();
const handleProducts = new (require("../ProductManager"))();

router.get("/", async (request, response) => {
  let res = await handleProducts.getProducts();

  let { limit } = request.query;
  if (limit) {
    res = res.slice(0, limit);
  }
  response.send(res);
});

router.get("/:pid", async (request, response) => {
  const params = Number(request.params.pid);
  const product = await handleProducts.getProductById(params);
  console.log(product);
  !product
    ? response.send({
        error: `No se a econtrado nungun producto con id(${params})`,
      })
    : response.send(product);
});

router.delete("/:pid", async (request, response) => {
  const params = Number(request.params.pid);
  const res = await handleProducts.deleteProduct(params);

  response.send(res.statusMsj);
});

router.post("/", async (request, response) => {
  const newProduct = request.body;

  let res = await handleProducts.addProduct(newProduct);
  console.log(res, "rs");

  if (res.status) {
  }

  response.send(res);
});

router.put("/:pid", async (request, response) => {
  const foundID = request.params.pid;
  const newData = request.body;
  const res = await handleProducts.updateProduct(foundID, newData);
  response.send("Se agrego correctamente ");
});

module.exports = router;
