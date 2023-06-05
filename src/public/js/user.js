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
    if (!isNaN(Number(data.firstname)))
      throw {
        msg: "El dato ingresado el el campo nombre no es valido",
        inputError: "nombre",
      };

    if (!isNaN(Number(data.lastname)))
      throw { msg: "El dato ingresado el el campo apellido no es valido" };

    if (!validarUsername(data.username))
      throw { msg: "El dato ingresado el el campo username no es valido" };

    if (!validarEmail(data.email))
      throw { msg: "El dato ingresado el el campo email no es valido" };

    if (!validarDireccion(data.adress))
      throw { msg: "El dato ingresado el el campo direccion no es valido" };

    if (!validarPassword(data.password))
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
  const firstname = formulario.elements["nombre"].value;
  const lastname = formulario.elements["apellido"].value;
  const fullname = `${firstname} ${lastname}`;
  const username = formulario.elements["username"].value;
  const email = formulario.elements["email"].value;
  const adress = formulario.elements["direccion"].value;
  const password = formulario.elements["contrasena"].value;
  const isAdmin = false;

  const data = {
    firstname,
    lastname,
    fullname,
    username,
    email,
    adress,
    password,
    isAdmin,
  };
  console.log(JSON.stringify(data));
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
