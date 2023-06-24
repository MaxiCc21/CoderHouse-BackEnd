const { Router, response, request } = require("express");
const { passportAuth } = require("../config/passportAuth");
const { authorizaton } = require("../config/passportAuthorization");
const router = Router();
const cartHandle = new (require("../dao/MongoManager/CartManager"))();

router.get("/", passportAuth("jwt"), authorizaton("user"), async (req, res) => {
  console.log("/api/carts");
  const user = req.user;
  const jwtUser = user ? user : false;

  const productDataUser = await cartHandle.getItemToCart(jwtUser.sub);

  if (!productDataUser.ok) {
    res.status(400).send("Algo salio mal al cargar los productos");
  }
  //Tengo que usar socket.io para modificar el carrito para no hcer refresco de paguina
  console.log(productDataUser.statusMsj);
  const options = {
    title: "Carrito de compras",
    style: "cart.css",
    products: productDataUser.data,
    usercookie: jwtUser.username ? jwtUser.username : null,
  };

  res.render("cart/cart.handlebars", options);
});

router.get("/:cid", async (request, response) => {
  let { cid } = request.params;

  let res = await cartHandle.getItemById(cid);

  if (!res) {
    response.send("Todo mal");
  }

  response.send(res);
});

router.post("/:cid/product/:pid", async (request, response) => {
  let { cid } = request.params;
  let { pid } = request.params;
  let body = { id: 1, name: "hola" };
  let res = await cartHandle.addItem(cid, pid, body);
  // console.log(res.status, res.statusMsj);
  response.send(res);
});

router.post("/", async (request, response) => {
  let res = await cartHandle.createNewCart();
  if (!res) {
    response.send("A ocurrido un error");
  }
  response.send(res);
});

// Delete Item
router.delete("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params,
    body = req.body;
  let found = await cartHandle.getItemById(cid);
  console.log(found);
  res.send("Hola");
});

module.exports = router;
