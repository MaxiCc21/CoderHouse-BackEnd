const forgotPasswordButton = document.getElementById(
  "userForgotPasswordButton"
);
const loginForm = document.getElementById("userLoginForm");
const userLoginButton = document.getElementById("userLoginButton");

if (loginErrorMessage !== "false") {
  alert(loginErrorMessage);
}

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
