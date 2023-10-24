let elementos = document.querySelectorAll("#text");

elementos.forEach(function (span) {
  if (span.textContent.length > 68) {
    span.style.bottom = -15;
  }
});
// if (logoutButton) {
//   logoutButton.addEventListener("click", (e) => {
//     fetch("/home", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   });
// }

if (paymentStatusMessage) {
  alert(paymentStatusMessage);
  window.location.href = "/home";
}
const $productTitleP = document.querySelectorAll("#productTitle");

$productTitleP.forEach(function (p) {
  if (p.textContent.length > 68) {
    p.style.bottom = -15;
  }
});
