console.log("Socket CHAT");
const socket = io();

socket.on("message", async (data) => {
  console.log(data);
});

const $MessageArea = document.querySelector(".chat-area");

socket.on("send-all-messages", async (data) => {
  let tooAdd = "";
  data.forEach((el) => {
    tooAdd += `
    <div class="message">
    <span class="sender">${el.user}</span>
    <span class="content">${el.message}</span>
  </div>`;
    $MessageArea.innerHTML = tooAdd;
  });
});

const $form = document.getElementById("message-form");

$form.addEventListener("submit", (e) => {
  const user = $form.elements["user"].value;
  const message = $form.elements["message"].value;
  if (!user || !message) {
    e.preventDefault();
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Alguno de los campos esta vacio",
    });
  } else {
    let data = { user, message };
    socket.emit("new-message", data);
  }
});
