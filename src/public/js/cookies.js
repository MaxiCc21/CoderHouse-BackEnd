const formulario = document.getElementById("form-cookie");
formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const datosFormulario = new FormData(formulario);
  const data = {};

  datosFormulario.forEach((value, key) => (data[key] = value));

  fetch("/cookie/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
});
