const $form = document.getElementById("showProduct-form");

$form.addEventListener("submit", (e) => {
  const formulario = new FormData($form);

  const productID = formulario.get("productID");

  console.log(productID);
  fetch(`/products/${productID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
});

const ratingProductValue = document.getElementById("ratingProductValue").value;
setRating(ratingProductValue);

function setRating(rating) {
  const stars = document.querySelectorAll(".rating input");

  stars.forEach((star) => {
    if (star.value == rating) {
      star.checked = true;
    }
  });
}
