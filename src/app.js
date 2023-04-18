const express = require("express");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/carts.routes");
const viersRoutes = require("./routes/views.routes");
const cokieParser = require("cookie-parser");
const { uploader } = require("./utils/multer");

const app = express();
// HandleBars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + `/views`);
app.set("view engine", "handlebars");
// HandleBars

app.use(express.json());
app.use(cokieParser());
app.use("/static", express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));

app.post("/single", uploader.single("myFile"), (res, req) => {
  res.status(200).send("Todo ok");
});

app.use("/products", productRoutes);

app.use("/api/carts", cartRoutes);

app.use("/home", viersRoutes);

app.listen(8080);
