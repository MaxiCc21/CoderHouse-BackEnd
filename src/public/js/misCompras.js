function mostrarTextoCompleto() {
  const textoRecortado = document.getElementById("texto-recortado");
  const textoCompleto = document.getElementById("texto-completo");
  textoCompleto.textContent = "Hola como estas";
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
