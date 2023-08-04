const sendInput = document.getElementById("send-input");
const barra = document.querySelector(".barra");
const fetchInput = document.getElementById("fetch-input");
const barra2 = document.getElementById("barra2");

sendInput.addEventListener("change", function () {
  if (sendInput.checked) {
    barra.classList.add("barra-azul");
    fetchInput.checked = false; // Desmarca el otro checkbox
    barra2.classList.remove("barra-azul"); // Remueve la clase del otro checkbox
  } else {
    barra.classList.remove("barra-azul");
  }
});

fetchInput.addEventListener("change", function () {
  if (fetchInput.checked) {
    barra2.classList.add("barra-azul");
    sendInput.checked = false; // Desmarca el otro checkbox
    barra.classList.remove("barra-azul"); // Remueve la clase del otro checkbox
  } else {
    barra2.classList.remove("barra-azul");
  }
});

// ------------------------------------------------

const $formShopping = document.getElementById("formShoppingWay");

// $formShopping.addEventListener("submit", (e) => {
//   fetch("/comprar", {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// });
