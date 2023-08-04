function mostrarTextoCompleto() {
  const textoRecortado = document.getElementById("texto-recortado");
  const textoCompleto = document.getElementById("texto-completo");
  textoCompleto.textContent = "Hola como estas"; // Cambiar este texto por el que desees mostrar completo
  textoRecortado.style.display = "none";
  textoCompleto.style.display = "block";
}

function ocultarTextoCompleto() {
  const textoRecortado = document.getElementById("texto-recortado");
  const textoCompleto = document.getElementById("texto-completo");
  textoRecortado.style.display = "inline";
  textoCompleto.style.display = "none";
}

// ----------------------------------------------------
