const { Router } = require("express");
const { faker } = require("@faker-js/faker");
const compression = require("express-compression");

const router = Router();

router.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);

class Persona {
  constructor() {
    this._id = faker.database.mongodbObjectId();
    this.title = faker.commerce.product();
    this.description = faker.commerce.productDescription();
    this.price = faker.commerce.price({
      min: 5000,
      max: 15000,
      dec: 2,
      symbol: "$",
    });
    this.thumbnail = faker.image.url();
    this.stock = faker.number.int({
      min: 2,
      max: 25,
    });
    this.createTime = faker.date.past();
    this.rating = faker.number.int({
      min: 1,
      max: 5,
    });
  }
}

router.get("/", (req, res) => {
  const numeroDeDatos = 100;
  const personas = [];

  for (let i = 0; i < numeroDeDatos; i++) {
    personas.push(new Persona());
  }

  res.send(personas);
});

module.exports = router;
