const { Router, response, request } = require("express");
const router = Router();
const chatHandle = new (require("../dao/MongoManager/ChatManager"))();

const compression = require("express-compression");

// router.use(compression());

router.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);

router.get("/stringmuylargo", async (req, res) => {
  let string = "Hola coders, soy un string ridiculamente largo";
  for (let i = 0; i < 5e4; i++) {
    string += "Hola coders, soy un string ridiculamente largo";
  }
  res.send(string);
});

module.exports = router;
