const express = require("express");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/carts.routes");
const viersRoutes = require("./routes/views.routes");
const cokieParser = require("cookie-parser");
const { uploader } = require("./utils/multer");
const productHandle = new (require("./ProductManager"))();

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

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Todo mal");
});

// Socket-----------------------------------------------------------------------------

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { style: "realTime.css" });
});

const { Server } = require("socket.io");

const { send } = require("process");

const httpServer = app.listen(8080);

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  socket.emit("message", "Se conectado un usuario");
  let data = await productHandle.getProducts();

  socket.emit("show-All-Products", data);

  socket.on("addProduct", async (data) => {
    let res = await productHandle.addProduct(data);
    console.log(res);
  });

  socket.on("eliminar-producto", async (dataID) => {
    let res = await productHandle.deleteProduct(dataID);
    console.log(res.statusMsj);
  });
});
