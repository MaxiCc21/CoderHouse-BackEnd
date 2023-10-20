const sendInput = document.getElementById("send-input");
const barra = document.querySelector(".barra");
const fetchInput = document.getElementById("fetch-input");
const barra2 = document.getElementById("barra2");

sendInput.addEventListener("change", function () {
  if (sendInput.checked) {
    barra.classList.add("barra-azul");
    fetchInput.checked = false;
    barra2.classList.remove("barra-azul");
  } else {
    barra.classList.remove("barra-azul");
  }
});

fetchInput.addEventListener("change", function () {
  if (fetchInput.checked) {
    barra2.classList.add("barra-azul");
    sendInput.checked = false;
    barra.classList.remove("barra-azul");
  } else {
    barra2.classList.remove("barra-azul");
  }
});

// ------------------------------------------------

const $formShopping = document.getElementById("formShoppingWay");
