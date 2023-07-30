const mercadoPagoInput = document.getElementById("mercadoPago-payment-input");
const barraMercadoPago = document.getElementById("barraMercadoPago");
const sendInput = document.getElementById("send-input");
const barra = document.querySelector(".barra");
const fetchInput = document.getElementById("input-methodPayment-VisaDebito");
const barra2 = document.getElementById("barra-methodPayment-VisaDebito");

sendInput.addEventListener("change", function () {
  if (sendInput.checked) {
    barra.classList.add("barra-azul");
    // fetchInput.checked = false;
    barra2.classList.remove("barra-azul");
    // mercadoPagoInput.checked = false;
    barraMercadoPago.classList.remove("barra-azul");
  } else {
    barra.classList.remove("barra-azul");
  }
});

fetchInput.addEventListener("change", function () {
  if (fetchInput.checked) {
    barra2.classList.add("barra-azul");
    // sendInput.checked = false;
    barra.classList.remove("barra-azul");
    // mercadoPagoInput.checked = false;
    barraMercadoPago.classList.remove("barra-azul");
  } else {
    barra2.classList.remove("barra-azul");
  }
});
mercadoPagoInput.addEventListener("change", function () {
  if (mercadoPagoInput.checked) {
    barraMercadoPago.classList.add("barra-azul");
    // fetchInput.checked = false;
    barra2.classList.remove("barra-azul");
    // sendInput.checked = false;
    barra.classList.remove("barra-azul");
  } else {
    barraMercadoPago.classList.remove("barra-azul");
  }
});

// ------------------------------------------------

const $formShopping = document.getElementById("formShoppingWay");

$formShopping.addEventListener("submit", (e) => {
  const data = {
    id: 1,
  };

  fetch("/comprar/methodPayment", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });
});

function myFuncion(thisInput) {
  const allinput = document.querySelectorAll("input");

  allinput.forEach((input) => {
    if (input != thisInput) {
      input.checked = false;
    }
  });
}
