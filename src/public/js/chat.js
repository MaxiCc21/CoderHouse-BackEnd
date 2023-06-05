const socket = io();

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

function Delete(id) {
  Swal.fire({
    title: `Seguro que dese eliminar el producto id(${id})`,
    showConfirmButton: false,
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "",
    denyButtonText: `Eliminar`,
  }).then((result) => {
    if (result.isDenied) {
      const res = socket.emit("eliminar-producto", id);
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}

function Update(id) {
  console.log(id);
}

socket.on("message", (msg) => {
  console.log(msg);
});

socket.on("show-All-Products", (data) => {
  const $list = document.getElementById("list-products");

  let tooAdd = "";

  data.forEach((el) => {
    JSON.stringify(el);
    tooAdd += `
    <div class="product-box">
        <img class="img" src=${el.thumbnail}>
        <h1 class="title">${el.title}</h1>
        <div class="product-box-button-section">
          <button class="delete-button" onClick=Delete("${el._id}")>Eliminar</button>
          <button class="update-button" onClick=Update("${el._id}")>Editar</button>
        </div>
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
