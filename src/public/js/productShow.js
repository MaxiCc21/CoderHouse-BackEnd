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
