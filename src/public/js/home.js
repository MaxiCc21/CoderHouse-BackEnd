console.log("home");

const d = document;

let elementos = d.querySelectorAll("#text");

// Modificar la propiedad 'height' de cada elemento
elementos.forEach(function (span) {
  if (span.textContent.length > 68) {
    span.style.bottom = -15;
  }
});
