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

router.get("/simple", (req, res) => {
  let suma = 0;

  for (let i = 0; i < 10000000; i++) {
    suma += 1;
  }
  // artillery quick --count 40 --num 50   'http://localhost:8080/prueba/simple' -o simple.json
  res.send({
    status: "succes",
    mesage: `El worker ${procces.id} a atendido esta peticion, resultado es ${suma}`,
  });
});

router.get("/complejo", (req, res) => {
  let suma = 0;

  for (let i = 0; i < 5e8; i++) {
    suma += 1;
  }

  res.send({
    status: "succes",
    mesage: `El worker ${procces.id} a atendido esta peticion, resultado es ${suma}`,
  });
});

router.get("/stringmuylargo", async (req, res) => {
  let string = "Hola coders, soy un string ridiculamente largo";
  for (let i = 0; i < 5e4; i++) {
    string += "Hola coders, soy un string ridiculamente largo";
  }
  res.send(string);
});

module.exports = router;
