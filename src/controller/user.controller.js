const { logger } = require("../middlewares/logger");
const { userService, cartService, ticketService } = require("../service");
const { generateToke } = require("../utils/jwt");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { sendMail } = require("../utils/sendmail");
const bcrypt = require("bcrypt");
const { tr } = require("@faker-js/faker");
const { options } = require("../routes/user.routes");

class UserController {
  allUsersGET = async (req, res) => {
    let data = await handleUser.getAllUser();
    let options = {
      style: "user_Ingresar.css",
      data,
    };

    res.send(options.data);
  };

  misComprasGET = async (req, res) => {
    const jwtUser = req.user;
    const foundSendTicket = await ticketService.getSendTicket(jwtUser.sub);

    const options = {
      style: "misCompras.css",
      data: foundSendTicket.data,
      usercookie: jwtUser,
    };

    if (!foundSendTicket.ok) {
      res.status(400).send(foundSendTicket.statusMsj);
    } else {
      res.render("shopping/misCompras", options);
    }
  };

  paginateGET = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    let data = await handleUser.getAllUserPaginate(page, limit);

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

  githubGET = (req, res) => {
    res.send("GET request to the homepage");
  };

  githubcallbackGET = async (req, res) => {
    req.session.user = req.user;

    res.redirect("/home");
  };

  deleteUserDELETE = async (req, res) => {
    let pid = req.params.pid;

    let myRes = await handleUser.deletUser(pid);
    if (!myRes) {
      logger.info("Objeto eliminado exitosamento");
    } else {
      res.send("A ocurrido un error al eliminar el objeto");
    }
  };

  updateUserPUT = async (req, res) => {
    let pid = req.params.pid;
    let bodyData = req.body;

    let myRes = await handleUser.updateUser(pid, bodyData);

    if (!myRes) {
      res.send("Se an realizado los cambios correctamente");
    } else {
      res.send("A ocurrido un erro");
    }
  };

  premiumGET = async (req, res) => {
    const JWTuser = req.user;

    if (JWTuser.role === "premium") {
      res.redirect("/publicar");
    } else {
      const options = {
        style: "bePremium.css",
        usercookie: JWTuser,
      };

      res.render("publicar/bePremium", options);
    }
  };

  premiumPOST = async (req, res) => {
    const JWTuser = req.user;

    const updateStatusUser = await userService.changeStatus(
      JWTuser.sub,
      "premium"
    );
    if (updateStatusUser.ok) {
      const newData = {
        sub: JWTuser._id,
        username: JWTuser.username,
        fullname: JWTuser.fullname,
        role: "premium",
        email: JWTuser.email,
        address: JWTuser.address,
        isAdmin: JWTuser.isAdmin,
      };

      const newToken = generateToke(newData);

      res.cookie("jwtCoder", newToken, {
        maxAge: 100000 * 60,
        httpOnly: true,
      });

      res.redirect("/publicar");
    } else {
      res.send(updateStatusUser.statusMsj);
    }
  };

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

  // ----------------- Admin -----------------
  adminUserEditGET = async (req, res) => {
    const JWTuser = req.user;
    let { uid } = req.params;
    const userToEdit = await userService.getUserByID(uid);

    if (!userToEdit.ok) {
      res.status(userToEdit.status).send(userToEdit.statusMsj);
    } else {
      const options = {
        style: "userEditAdmin.css",
        usercookie: JWTuser,
        data: userToEdit.data,
      };

      res.status(userToEdit.status).render("admin/userEditAdmin", options);
    }
  };

  adminUserEditPOST = async (req, res) => {
    const { newOnlineStatus } = req.body;
    const { uid } = req.params;
    const editUserStatus = await userService.updateUserStatus(
      uid,
      newOnlineStatus
    );

    res.status(editUserStatus.status).json(editUserStatus);
  };

  adminUserCreateNewUserGET = (req, res) => {
    const JWTUser = req.user;

    const options = {
      style: "createNewUserAdmin.css",
      usercookie: JWTUser,
    };

    res.render("admin/createNewUserAdmin", options);
  };

  adminUserCreateNewUserPOST = async (req, res) => {
    try {
      const dataNewUser = req.body;

      const createNewAdmin = await userService.createNewUser(dataNewUser, true);

      // if (createNewAdmin.status === 500) {
      //   logger.error(createNewAdmin.err);
      // }

      if (createNewAdmin.status > 399) {
        res
          .status(createNewAdmin.status)
          .json({ error: createNewAdmin.statusMsj });
      } else {
        res.status(201).json(createNewAdmin);
      }
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Error interno del servidor: " + err.message });
    }
  };

  // ----------------- Admin -----------------
}
module.exports = new UserController();
