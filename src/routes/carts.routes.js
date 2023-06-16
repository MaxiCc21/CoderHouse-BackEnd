const { Router, response, request } = require("express");
const router = Router();
const cartHandle = new (require("../dao/MongoManager/CartManager"))();

router.get("/", async (req, res) => {
  let myres = await cartHandle.getItem();
  res.send(myres);
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
  let body = request.body;
  let res = await cartHandle.addItem(cid, pid, body);
  console.log(res.status, res.statusMsj);
  response.send(res.statusMsj);
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
