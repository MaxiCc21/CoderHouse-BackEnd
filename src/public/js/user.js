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
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.msg,
      background: "#fff",
    });
    return err;
  }
}

// const RegisterForm = document.getElementById("creteUser-form");
// if (RegisterForm) {
//   RegisterForm.addEventListener("submit", (e) => {
//     RegisterForm.addEventListener("submit", async (e) => {
//       const datosFormulario = new FormData(RegisterForm);
//       const firstname = datosFormulario.get("firstname");
//       const lastname = datosFormulario.get("lastname");
//       const username = datosFormulario.get("username");
//       const email = datosFormulario.get("email");
//       const address = datosFormulario.get("address");
//       const password = datosFormulario.get("password");
//       const fullname = `${firstname} ${lastname}`;

//       const data = {
//         firstname,
//         lastname,
//         fullname,
//         username,
//         email,
//         address,
//         password,
//       };

//       fetch("/session/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//     });
//   });
// }

// --------------------------------------------------
//UserLogin

const forgotPasswordButton = document.getElementById(
  "userForgotPasswordButton"
);
const loginForm = document.getElementById("userLoginForm");
const userLoginButton = document.getElementById("userLoginButton");

userLoginButton.addEventListener("click", function (e) {
  const datosFormulario = new FormData(loginForm);

  const identification = datosFormulario.get("identification");
  const password = datosFormulario.get("password");

  const data = {
    identification,
    password,
  };

  fetch("/session/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
});

if (forgotPasswordButton) {
  forgotPasswordButton.addEventListener("click", function (e) {
    e.preventDefault();

    window.location.href = "recover-password";
  });
}
