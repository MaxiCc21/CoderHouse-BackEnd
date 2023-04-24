console.log("Socket");

const socket = io();

function Eliminar(id) {
  console.log(id);

  socket.emit("eliminar-producto", id);
}

socket.on("message", (msg) => {
  console.log(msg);
});

socket.on("show-All-Products", (data) => {
  const $list = document.getElementById("list-products");

  let tooAdd = "";

  data.forEach(({ id, title, thumbnail, description }) => {
    tooAdd += `
    <div class="product-box">
        <img class="img" src=${thumbnail}>
        <h1 class="title">${title}</h1>
        <button onClick=Eliminar(${id})>Eliminar</button>
    </div>`;
    $list.innerHTML = tooAdd;
  });

  //   cloneNode
});

const $form = document.getElementById("formAddProduct");
let title = document.getElementById("formAddProduct-input-title");
let description = document.getElementById("formAddProduct-input-description");
let price = document.getElementById("formAddProduct-input-price");
let thumbnail = document.getElementById("formAddProduct-input-thumbnail");
let categoy = document.getElementById("formAddProduct-input-categoy");
let marca = document.getElementById("formAddProduct-input-marca");
let stock = document.getElementById("formAddProduct-input-stock");

let inputs = document.querySelectorAll("input");

$form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (hasAllData()) {
    let newData = newProductCreate();
    console.log(newData);
    socket.emit("addProduct", newData);
  } else {
    alert("Tiene que ingresar todos los datos");
  }
});

function newProductCreate() {
  return {
    title: title.value,
    description: description.value,
    price: Number(price.value),
    thumbnail: thumbnail.value,
    categoy: ["electro", "tv"],
    marca: marca.value,
    stock: Number(stock.value),
  };
}

function hasAllData() {
  if (
    title.value &&
    description.value &&
    price.value &&
    thumbnail.value &&
    categoy.value &&
    marca.value &&
    stock.value
  ) {
    return true;
  } else {
    return false;
  }
}
