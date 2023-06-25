console.log("Socket CHAT");
const socket = io();

socket.on("message", async (data) => {
  console.log(data);
});

const $AgregarButton = document.querySelectorAll("#cart_AgregarItem");
const $EliminarButton = document.querySelectorAll("#cart_EliminiarItem");

const $productIdInput = document.querySelectorAll("#productID_input");
const $userIdInput = document.getElementById("userID_input").value;

$EliminarButton.forEach((node, index) => {
  node.addEventListener("click", (e) => {
    e.preventDefault();
    socket.emit("cartDeleteItem", $userIdInput, $productIdInput[index].value);
  });
});

$AgregarButton.forEach((node, index) => {
  node.addEventListener("click", (e) => {
    e.preventDefault();
    socket.emit("cartAddItem", $userIdInput, $productIdInput[index].value);
  });
});

socket.on("okModCart", async (data) => {
  console.log(data);
  location.reload();
});
