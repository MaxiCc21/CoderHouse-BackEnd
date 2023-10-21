document.addEventListener("DOMContentLoaded", function () {
  const editCheckboxes = document.querySelectorAll(".editCheckbox");

  editCheckboxes.forEach(function (checkbox) {
    const relatedField = checkbox.previousElementSibling; // El campo relacionado es el hermano anterior de la casilla de verificación

    checkbox.addEventListener("change", function () {
      relatedField.disabled = !checkbox.checked;
    });
  });
});
