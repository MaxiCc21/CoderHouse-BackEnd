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

const $productTitleP = document.querySelectorAll("#productTitle");

$productTitleP.forEach(function (p) {
  if (p.textContent.length > 68) {
    p.style.bottom = -15;
  }
});
