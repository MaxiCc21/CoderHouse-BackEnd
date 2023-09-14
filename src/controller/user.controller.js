const { logger } = require("../middlewares/logger");
const { userService, cartService, ticketService } = require("../service");
const { generateToke } = require("../utils/jwt");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { sendMail } = require("../utils/sendmail");
const bcrypt = require("bcrypt");
const { tr } = require("@faker-js/faker");

class UserController {
  getUserByIDGET = async (req, res) => {
    let { uid } = req.params;
    const foundUser = await userService.getUserByID(uid);

    if (foundUser) {
      res.status(201).send(foundUser);
    } else {
      res.status(400).send(foundUser);
    }
  };

  getPaginate = async (req, res) => {
    const JWTuser = req.user;
    const page = req.query.page || 1;
    let data = await userService.getAllUserPaginate(page, 6);
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
      usercookie: JWTuser,
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
      role: data.status,
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

  //* ------------Recover------------
  recoverGET = async (req, res) => {
    const options = {
      style: "recoverPassword.css",
      simpleNavBar: true,
    };
    res.render("users/recoverPassword", options);
  };

  recoverPOST = async (req, res) => {
    let userEmail = req.body.email;

    const foundEmail = await userService.getUserByEmail(userEmail);
    logger.info(foundEmail.statusMsj);

    if (foundEmail.ok) {
      const { email, username } = foundEmail.data;

      const templateFilePath = path.resolve(
        __dirname,
        "..",
        "views",
        "email",
        "emailTemplate.handlebars"
      );

      const templateSource = fs.readFileSync(templateFilePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);

      const templateData = {
        username: username,
        useremail: email,
      };

      const htmlContent = compiledTemplate(templateData);

      const to = email;
      const subject = "Recuperacion de contraseña";
      const html = htmlContent;
      let resurl = await sendMail(to, subject, html);

      res.cookie("emailToRecoverPassword", email, {
        maxAge: 900000,
        httpOnly: true,
      });

      res.send(foundEmail);
    } else {
      res.redirect("/session/recover-password");
    }
  };

  modifyGET = async (req, res) => {
    const options = {
      style: "modifyPassword.css",
      userEmail: req.cookies.emailToRecoverPassword,
    };
    console.log("Status: ", req);
    res.render("users/modifyPassword", options);
  };

  modifyPOST = async (req, res) => {
    try {
      const userEmail = req.cookies.emailToRecoverPassword;
      const foundUser = await userService.getUserByEmail(userEmail);
      const userProvidedPassword = req.body.newPassword;
      const storedHashedPassword = foundUser.data.password;
      const saltRounds = 10;
      const options = {
        style: "modifyPassword.css",
        userEmail,
        message: "Debe elegir una contraseña distinta",
      };

      const result = await bcrypt.compare(
        userProvidedPassword,
        storedHashedPassword
      );

      if (!result) {
        // La contraseña es la misma
        logger.error("La contraseña es idéntica");
        return res.status(400).render("users/modifyPassword", options);
      }

      const newHashedPassword = await bcrypt.hash(
        userProvidedPassword,
        saltRounds
      );

      if (newHashedPassword) {
        const updateUser = await userService.updateUserByEmail(
          userEmail,
          newHashedPassword
        );
        return res.send(updateUser.statusMsj);
      } else {
        return res.status(400).send(updateUser.statusMsj);
      }
    } catch (err) {
      // Manejar otros errores aquí
      logger.error(err);
      return res.status(500).send("Error interno del servidor");
    }
  };
}
module.exports = new UserController();
