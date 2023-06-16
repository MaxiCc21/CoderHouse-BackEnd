const { Router, response, request } = require("express");
const router = Router();
const handleProducts = new (require("../dao/MongoManager/ProductManager"))();

router.get("/", async (req, res) => {
  console.log("/Home");
  const { username } = req.cookies;
  let listProducts = await handleProducts.getProducts();

  const authHeader = req.headers.authorization;

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
