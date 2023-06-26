const { Router, response, request } = require("express");
const { authToken } = require("../utils/jwt");
const { authorizaton } = require("../config/passportAuthorization");
const { passportAuth } = require("../config/passportAuth");
const router = Router();
const handleProducts = new (require("../dao/MongoManager/ProductManager"))();
const handleCart = new (require("../dao/MongoManager/CartManager"))();

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

router.get(
  "/:pid",

  passportAuth("jwt"),
  authorizaton("PUBLIC"),
  async (req, res) => {
    const pid = req.params.pid;

    const product = await handleProducts.getProductById(pid);

    if (!product) {
      res.send({
        error: `No se a econtrado nungun producto con id(${pid})`,
      });
    }
    const jwtUser = req.user ? req.user : false;
    const options = {};
    options.style = "productShow.css";
    options.product = product[0];
    options.usercookie = jwtUser;
    res.render("products/product_show.handlebars", options);
  }
);

router.post(
  "/:pid",
  passportAuth("jwt"),
  authorizaton("user"),

  async (req, res) => {
    console.log("#POST /Agregar al carrito");
    const foundProduct = await handleProducts.getProductById(req.params.pid);

    if (!foundProduct) {
      res.send({ status: "error", statusMsg: "No se a econtrado un producto" });
    } else {
      if (req.body.action === "comprar") {
        console.log("comprar");

        res.send("comprar");
      } else if (req.body.action === "carrito") {
        let cid = req.user.sub;
        let pid = foundProduct[0]._id;
        let body = foundProduct[0];
        const itemAdd = await handleCart.addItem(cid, pid, body);
        console.log(itemAdd);
        res.send({ cid, pid, body });
      }
    }
  }
);

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
