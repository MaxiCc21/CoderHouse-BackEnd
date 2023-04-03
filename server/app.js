import express from "express";
import { ProductManager } from "../ProductManager";
const app = express();

const handleProducts = new ProductManager();

app.use(express.urlencoded({ extended: true }));

app.get("/", async (request, response) => {
  let res = await handleProducts.getProducts();
  response.send(res);
});

app.get("/products", async (request, response) => {
  let res = await handleProducts.getProducts();

  let { limit } = request.query;
  if (limit) {
    res = res.slice(0, limit);
  }
  response.send(res);
});

app.get("/products/:pid", async (request, response) => {
  let res = await handleProducts.getProducts();
  console.log(res);

  let pid = parseInt(request.params.pid);

  const newRes = res.find((el) => {
    console.log(typeof el.id);
    console.log(typeof pid);
    el.id == pid;
  });

  console.log(newRes);
  if (!newRes) {
    return response.send({ error: "No se a encotrado producto con ese ID" });
  } else {
    return response.send(newRes);
  }
});
// let { pid } = request.params;
// if (pid) {
//   res = res.find((el) => {
//     el.id == pid;
//   });
// }

app.listen(8888);
