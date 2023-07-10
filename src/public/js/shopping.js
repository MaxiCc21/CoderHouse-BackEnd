const checkbox = document.getElementById("miCheckbox");
const barra = document.querySelector(".barra");
const checkbox2 = document.getElementById("miCheckbox2");
const barra2 = document.getElementById("barra2");

checkbox.addEventListener("change", function () {
  if (checkbox.checked) {
    barra.classList.add("barra-azul");
    checkbox2.checked = false; // Desmarca el otro checkbox
    barra2.classList.remove("barra-azul"); // Remueve la clase del otro checkbox
  } else {
    barra.classList.remove("barra-azul");
  }
});

checkbox2.addEventListener("change", function () {
  if (checkbox2.checked) {
    barra2.classList.add("barra-azul");
    checkbox.checked = false; // Desmarca el otro checkbox
    barra.classList.remove("barra-azul"); // Remueve la clase del otro checkbox
  } else {
    barra2.classList.remove("barra-azul");
  }
});
