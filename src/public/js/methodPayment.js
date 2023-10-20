const mercadoPagoInput = document.getElementById("mercadoPago-payment-input");
const barraMercadoPago = document.getElementById("barraMercadoPago");
const sendInput = document.getElementById("send-input");
const barra = document.querySelector(".barra");
const fetchInput = document.getElementById("input-methodPayment-VisaDebito");
const barra2 = document.getElementById("barra-methodPayment-VisaDebito");

sendInput.addEventListener("change", function () {
  if (sendInput.checked) {
    barra.classList.add("barra-azul");

    barra2.classList.remove("barra-azul");

    barraMercadoPago.classList.remove("barra-azul");
  } else {
    barra.classList.remove("barra-azul");
  }
});

fetchInput.addEventListener("change", function () {
  if (fetchInput.checked) {
    barra2.classList.add("barra-azul");

    barra.classList.remove("barra-azul");

    barraMercadoPago.classList.remove("barra-azul");
  } else {
    barra2.classList.remove("barra-azul");
  }
});
mercadoPagoInput.addEventListener("change", function () {
  if (mercadoPagoInput.checked) {
    barraMercadoPago.classList.add("barra-azul");

    barra2.classList.remove("barra-azul");

    barra.classList.remove("barra-azul");
  } else {
    barraMercadoPago.classList.remove("barra-azul");
  }
});

// ------------------------------------------------

const $formShopping = document.getElementById("formShoppingWay");

function myFuncion(thisInput) {
  const allinput = document.querySelectorAll("input");

  allinput.forEach((input) => {
    if (input != thisInput) {
      input.checked = false;
    }
  });
}
