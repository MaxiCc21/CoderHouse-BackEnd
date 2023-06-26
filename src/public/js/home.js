console.log("home");

const d = document;
const logoutButton = d.getElementById("logout-button");

if (logoutButton) {
  logoutButton.addEventListener("click", (e) => {
    fetch("/home", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
}

var elementos = document.querySelectorAll("#text");

// Modificar la propiedad 'height' de cada elemento
elementos.forEach(function (elemento) {
  console.log(elemento, elemento.textContent.length);
  if (elemento.textContent.length > 68) {
    elemento.style.bottom = -15;
  }
});
