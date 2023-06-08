const { Router, response, request } = require("express");
const router = Router();
const handleProducts = new (require("../dao/MongoManager/ProductManager"))();

router.get("/", async (req, res) => {
  const { username } = req.cookies;
  let listProducts = await handleProducts.getProducts();

  let testUser = {
    products: listProducts,
    style: "home.css",
    usercookie: username,
  };

  res.render("home.handlebars", testUser);
});

router.post("/", (req, res) => {
  res.clearCookie("username").redirect("home");
});
module.exports = router;
