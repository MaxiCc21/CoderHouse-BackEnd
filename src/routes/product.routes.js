const { Router, response, request } = require("express");
const router = Router();
const handleProducts = new (require("../dao/MongoManager/ProductManager"))();

function midUser(req, res, next) {
  if (!req.body.userADMIN) {
    console.log("No tienes los permisos necesarios ");
  } else {
    next();
  }
}

router.get("/", async (request, response) => {
  let res = await handleProducts.getProducts();
  let { limit } = request.query;
  if (limit) {
    res = res.slice(0, limit);
  }
  response.send(res);
});

router.get("/:pid", async (request, response) => {
  const pid = request.params.pid;

  const product = await handleProducts.getProductById(pid);
  !product
    ? response.send({
        error: `No se a econtrado nungun producto con id(${pid})`,
      })
    : response.send(product);
});

router.delete("/:pid", async (req, res) => {
  let pid = req.params.pid;

  let myRes = await handleProducts.deleteProduct(pid);
  if (!myRes) {
    res.send("Producto eliminado exitosamento");
  } else {
    res.send("A ocurrido un error al eliminar el Producto");
  }
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
