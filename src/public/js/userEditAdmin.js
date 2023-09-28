const { logger } = require("../../middlewares/logger");

const form = document.getElementById("userEditAdminForm");

const onlineStatus = document.getElementById("onlineStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const datosFormulario = new FormData(form);
  const onLine = datosFormulario.get("online");
  // const isAdmin = datosFormulario.get("isAdmin");
  const userIDInput = document.getElementById("userID");
  const userID = userIDInput.dataset.userId;

  Swal.fire({
    title: "Quiere realizar los cambios?",
    html: `Quiere modificar el estado del usuario a: <span class="swal-${onLine}-color">${onLine.toUpperCase()}</span> <br>`,

    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Aplicar",
    denyButtonText: `Descartar Cambios`,
  }).then((result) => {
    if (result.isConfirmed) {
      const requestBody = {
        newOnlineStatus: onLine,
      };
      fetch(`/session/admin/userEdit/${userID}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }).then(async (response) => {
        const responseData = await response.json();
        if (responseData.ok) {
          window.location.href = "/session/admin/users?page=1";
        } else {
          logger.error("La solicitud no fue exitosa");
        }
      });
    } else if (result.isDenied) {
      Swal.fire("Los cambio no an sido aplicados", "", "info");
    }
  });
});
