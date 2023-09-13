const checkbox = document.getElementById("checkboxAceptConditionsBePremium");
const button = document.getElementById("buttonAceptConditionsBePremium");

checkbox.addEventListener("change", function () {
  if (checkbox.checked) {
    button.removeAttribute("disabled");
  } else {
    button.setAttribute("disabled", "true");
  }
});
