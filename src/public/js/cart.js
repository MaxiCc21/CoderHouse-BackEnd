console.log("Socket CHAT");
const socket = io();

socket.on("message", async (data) => {
  console.log(data);
});

const $SumarCantidadButton = document.querySelectorAll("#cartAddAmountProduct");
const $RestarCantidadButton = document.querySelectorAll(
  "#cartSubtractAmountProduct"
);
const $EliminarProductoA = document.querySelectorAll("#cartDeleteProduct");

const $productIdInput = document.querySelectorAll("#productID_input");
const $userIdInput = document.getElementById("userID_input").value;

$EliminarProductoA.forEach((link, index) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    socket.emit(
      "cartDeleteProduct",
      $userIdInput,
      $productIdInput[index].value
    );
  });
});

$RestarCantidadButton.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    socket.emit("cartDeleteItem", $userIdInput, $productIdInput[index].value);
  });
});

$SumarCantidadButton.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    socket.emit("cartAddItem", $userIdInput, $productIdInput[index].value);
  });
});

socket.on("okModCart", async (data) => {
  console.log(data);
  location.reload();
});
