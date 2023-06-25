const handleUser = new (require("../dao/MongoManager/UserManager"))();

class UserController {
  getPaginate = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    let data = await handleUser.getAllUserPaginate(page, limit);
    console.log(data);
    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = data;
    let options = {
      style: "showUser_paginate.css",
      users: docs,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      disabled: "disabled",
    };

    res.render("showUser_paginate.handlebars", options);
  };
}
module.exports = new UserController();
