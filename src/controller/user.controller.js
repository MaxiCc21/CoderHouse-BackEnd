const { logger } = require("../middlewares/logger");
const { userService, cartService, ticketService } = require("../service");
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
    const message = req.authInfo;

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
    const data = req.user;
    const message = req.authInfo;

    try {
      if (data) {
        const newTicketData = {
          id_user_to_ticket: data._id,
          username: data.username,
          email: data.email,
        };

        const crearCarrito = await cartService.createNewCart(data._id);
        const createTicketToUser = await ticketService.createNewTicket(
          newTicketData
        );

        // console.log(crearCarrito.statusMsj);
        // console.log(createTicketToUser.statusMsj);

        logger.info(`Mensaje: ${message}`);
        return res.status(200).redirect("/session/login");
      } else {
        logger.warning(`Mensaje: ${message}`);
        return res.status(400).redirect("/session/register");
      }
    } catch (err) {
      logger.fatal(err);
    }
  };
}
module.exports = new UserController();
