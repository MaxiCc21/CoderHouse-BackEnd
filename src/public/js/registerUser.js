// validacion.js
console.log("registerUser");
document.addEventListener("DOMContentLoaded", function () {
  const userForm = document.getElementById("creteUser-form");

  userForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const password = document.getElementById("password");

    if (!validarPassword(password.value)) {
      password.value = "";
      mostrarRequisitosContrasena();
      return;
    }

    userForm.submit();
  });

  function validarPassword(password) {
    return /^(?=(?:[^A-Z]*[A-Z]){1})(?=(?:\D*\d){2,}\D*$)[A-Za-z\d]{8,10}$/.test(
      password
    );
  }

  function mostrarRequisitosContrasena() {
    const requisitos = [
      "Al menos una letra mayúscula",
      "Al menos dos dígitos (números)",
      "No permite caracteres especiales",
      "Longitud de entre 8 y 10 caracteres",
    ];

    const mensaje =
      "La contraseña debe cumplir con los siguientes requisitos:\n\n" +
      requisitos.join("\n");
    Swal.fire(mensaje);
  }
});
function mostrarOcultarContrasena() {
  const checkbox = document.getElementById("mostrarContrasena");
  const contrasena = document.getElementById("password");

  if (checkbox.checked) {
    contrasena.type = "text";
  } else {
    contrasena.type = "password";
  }
}
