const { userService, cartService } = require("../service");
const { generateToke } = require("../utils/jwt");

class UserController {
  getPaginate = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    let data = await userService.getAllUserPaginate(page, limit);
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

  //* ------------Login------------

  loginGET = async (req, res) => {
    let options = {
      style: "user_Ingresar.css",
    };

    res.render("users/userLogin", options);
  };

  loginPOST = async (req, res) => {
    console.log("/login");
    const data = req.user;

    const newUser = {
      sub: data._id,
      username: data.username,
      fullname: data.fullname,
      role: "user",
      email: data.email,
      address: data.address,
      isAdmin: data.isAdmin,
    };
    const token = generateToke(newUser);
    try {
      const crearCarrito = await cartService.createNewCart(data._id);
      console.log(crearCarrito.statusMsj);
    } catch (err) {
      console.log(err);
    }

    res
      .cookie("jwtCoder", token, {
        maxAge: 100000 * 60,
        httpOnly: true,
      })
      .redirect("/home");
  };

  //* ------------Register------------

  registerGET = async (req, res) => {
    let options = {
      style: "userCrear.css",
      title: "Mercado-Libre | Usuario",
    };

    res.render("users/userRegister.handlebars", options);
  };

  registerPOST = async (req, res) => {
    res.redirect("/login");
  };
}
module.exports = new UserController();
