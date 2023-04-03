import express from "express";
import { ProductManager } from "./ProductManager.js";
const app = express();

const handleProducts = new ProductManager();

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (request, response) => {
  let res = await handleProducts.getProducts();

  let { limit } = request.query;
  if (limit) {
    res = res.slice(0, limit);
  }
  response.send(res);
});

app.get("/products/:pid", async (request, response) => {
  const params = Number(request.params.pid);
  const product = await handleProducts.getProductById(params);
  !product
    ? response.send({
        error: `No se a econtrado nungun producto con id(${params})`,
      })
    : response.send(product);
});

app.listen(8888);
