const { Router, response, request } = require("express");
const router = Router();
const cartHandle = new (require("../CartManager"))();

router.get("/:cid", async (request, response) => {
  let foundID = Number(request.params.cid);

  let res = await cartHandle.getItemById(foundID);

  response.send(res);
});

router.post("/:cid/product/:pid", async (request, response) => {
  let cid = Number(request.params.cid);
  let pid = Number(request.params.pid);
  let body = request.body;
  let res = cartHandle.addItem(cid, pid, body);

  response.send("Post");
});

router.post("/", async (request, response) => {
  let res = await cartHandle.createNewCart(request.body);
  response.send(res.statusMsj);
});

module.exports = router;
