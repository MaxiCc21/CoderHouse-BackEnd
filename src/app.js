const express = require("express");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/carts.routes");

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/products", productRoutes);

app.use("/api/carts", cartRoutes);

app.listen(8080);
