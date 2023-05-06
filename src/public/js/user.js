const nameRegex = /^[A-Za-zÁ-ú']{2,30}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^(?=.{4,16}$)(?=[a-z0-9_]*[A-Z])[a-zA-Z0-9_]*$/;
const addressRegex = /^[A-Za-z0-9\s,'-]{3,}$/;

function validarEmail(email) {
  return emailRegex.test(email);
}
function validarUsername(username) {
  return usernameRegex.test(username);
}
function validarDireccion(direccion) {
  return addressRegex.test(direccion);
}
function validarPassword(password) {
  return passwordRegex.test(password);
}

function validarDataTypeUser(data) {
  try {
    if (!isNaN(Number(data.nombre)))
      throw {
        msg: "El dato ingresado el el campo nombre no es valido",
        inputError: "nombre",
      };

    if (!isNaN(Number(data.apellido)))
      throw { msg: "El dato ingresado el el campo apellido no es valido" };

    if (!validarUsername(data.username))
      throw { msg: "El dato ingresado el el campo username no es valido" };

    if (!validarEmail(data.email))
      throw { msg: "El dato ingresado el el campo email no es valido" };

    if (!validarDireccion(data.direccion))
      throw { msg: "El dato ingresado el el campo direccion no es valido" };

    if (!validarPassword(data.contrasena))
      throw { msg: "El dato ingresado el el campo contraseña no es valido" };

    return true;
  } catch (err) {
    console.log(err.msg);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.msg,
      background: "#fff",
    });
    return err;
  }
}

const formulario = document.getElementById("creteUser-form");

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const nombre = formulario.elements["nombre"].value;
  const apellido = formulario.elements["apellido"].value;
  const username = formulario.elements["username"].value;
  const email = formulario.elements["email"].value;
  const direccion = formulario.elements["direccion"].value;
  const contrasena = formulario.elements["contrasena"].value;

  const data = {
    nombre,
    apellido,
    username,
    email,
    direccion,
    contrasena,
  };

  if (validarDataTypeUser(data)) {
    fetch("/handleUser/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
});