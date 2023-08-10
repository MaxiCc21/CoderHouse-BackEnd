generateUserErrorInfo = (user) => {
  return `One or more properties ware incomplete or not valid.
  listado de requerimientos de propiedades del user:
  *first_name:need to a String, received ${user.first_name}
  *last_name:need to a String, received ${user.last_name}
  *email:need to a String, received ${user.email}
  `;
};
