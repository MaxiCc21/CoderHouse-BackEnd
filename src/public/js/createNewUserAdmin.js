const formCreateNewUserAdmin = document.getElementById(
  "formCreateNewUserAdmin"
);
const loader = document.createElement("div");
loader.innerHTML = '<div class="loader"></div>';

formCreateNewUserAdmin.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Agrega el loader a la página mientras se procesa la solicitud
  Swal.fire({
    title: "Procesando...",
    html: loader.outerHTML,
    allowOutsideClick: false,
    showConfirmButton: false,
  });

  const datosFormulario = new FormData(formCreateNewUserAdmin);
  const dataNewUser = {};

  datosFormulario.forEach((valor, nombreCampo) => {
    dataNewUser[nombreCampo] = valor;
  });

  try {
    const response = await fetch("/session/admin/createNewUser", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataNewUser),
    });

    const responseData = await response.json();

    if (responseData.ok) {
      Swal.fire("Éxito", "Usuario creado con éxito", "success");
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    } else {
      Swal.fire("Error", responseData.error, "error");
      formCreateNewUserAdmin.reset();
    }
  } catch (err) {
    Swal.fire("Error", "Error en la solicitud: " + err.message, "error");
  }
});
