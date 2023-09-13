exports.socketMessage = (io) => {
  io.on("connection", async (socket) => {
    socket.emit("message", "Se conectado un usuario");
    let data = await productHandle.getProducts();
  });
};
