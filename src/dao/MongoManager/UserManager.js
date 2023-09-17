const { tr } = require("@faker-js/faker");
const { logger } = require("../../middlewares/logger");
const { isValidPassword } = require("../../utils/bcryptHas");
const { userModel } = require("../models/user.model");

const fs = require("fs");

class UserManager {
  constructor() {
    this.path = "./user.json";
  }

  getAllUserPaginate = async (page, limit) => {
    try {
      const users = await userModel.paginate({}, { page, limit, lean: true });
      return users;
    } catch (err) {}
  };

  getUserByEmail = async (email) => {
    try {
      let foundUser = await userModel.findOne({ email }).lean();

      if (foundUser) {
        return {
          status: "ok",
          statusMsj: "Se a validado la existencia del usuario",
          ok: true,
          data: foundUser,
        };
      }

      return {
        status: "error",
        statusMsj: "No se a podido validar la existencia del usuario",
        ok: false,
        data: undefined,
      };
    } catch (err) {
      logger.error(err);
    }
  };

  getAllUser = async () => {
    try {
      let users = await userModel.find().lean();
      return users;
    } catch (err) {}
  };

  getUserByID = async (idToFind) => {
    try {
      const foundUser = await userModel.findById(idToFind).lean();

      if (!foundUser) {
        return {
          status: 404,
          statusMsj: "No se a encontrado ningun usuario con dicho ID",
          ok: false,
          data: undefined,
        };
      }

      return {
        status: 200,
        statusMsj: "Se a encontrado un usuario",
        ok: true,
        data: foundUser,
      };
    } catch (err) {
      return err;
    }
  };

  createNewUser = async (data, isAdmin = false) => {
    let newUserData = data;
    let createUserMessage = "Usuario creado con exito";

    const existingUser = await userModel.findOne({
      username: newUserData.username,
      email: newUserData.email,
    });

    if (existingUser) {
      return {
        status: 400,
        statusMsj: "El usuario ya existe.",
        ok: false,
        data: undefined,
      };
    }

    try {
      if (isAdmin) {
        newUserData = {
          ...newUserData,
          isAdmin: true,
          status: "admin",
        };

        createUserMessage = "Usuario Admin creado con exito";
      }

      const createNewUser = await userModel.create({ username: "maxi" });

      if (!createNewUser) {
        return {
          status: 400,
          statusMsj: "No ha sido posible crear el usuario.",
          ok: false,
          data: undefined,
        };
      }

      return {
        status: 201,
        statusMsj: createUserMessage,
        ok: true,
        data: undefined,
      };
    } catch (err) {
      return {
        status: 500,
        statusMsj: "Error inesperado : ",
        err,
        ok: false,
        data: undefined,
      };
    }
  };

  deletUser = async (idToDelete) => {
    try {
      const user = await userModel.findByIdAndRemove(1);
    } catch (err) {
      return err;
    }
  };

  updateUser = async (pid, bodyData) => {
    try {
      await userModel.updateOne({ _id: pid }, bodyData);
    } catch (err) {
      return err;
    }
  };

  updateUserStatus = async (uid, newOnlineStatus) => {
    try {
      const updateUserStatus = await userModel.findOneAndUpdate(
        { _id: uid },
        { online: newOnlineStatus },
        { new: true }
      );

      if (!updateUserStatus) {
        return {
          status: 404,
          statusMsj: "No se a encotrado un ususario con ese id",
          ok: false,
          data: undefined,
        };
      }

      return {
        status: 200,
        statusMsj: "Cambio realizado con exito",
        ok: true,
        data: updateUserStatus,
      };
    } catch (err) {
      return {
        status: 504,
        statusMsj: "Ocurrio un error inesperado: ",
        err,
        ok: false,
        data: undefined,
      };
    }
  };

  updateUserByEmail = async (email, newHashedPassword) => {
    try {
      const updateUser = await userModel.updateOne(
        { email },
        { password: newHashedPassword }
      );

      if (!updateUser) {
        return {
          status: "error",
          statusMsj: "No se pudo modificar la contraseña",
          ok: false,
          data: undefined,
        };
      }

      return {
        status: "ok",
        statusMsj: "Contraseña actualizda",
        ok: true,
        data: updateUser,
      };
    } catch (err) {
      return err;
    }
  };

  loginValidation = async (identification, password) => {
    try {
      const found = await userModel.findOne({
        $or: [{ username: identification }, { email: identification }],
      });
      if (!found) {
        throw {
          status: "error",
          statusMsj: "No se a econtrado un usuario",
          ok: false,
        };
      } else {
        if (isValidPassword(password, found.password)) {
          return {
            status: "ok",
            statusMsj: "Bienvenido",
            username: found.username,
            found,
            ok: true,
          };
        } else {
          return {
            status: "err",
            statusMsj: "La contraseña es incorrecta",
            ok: false,
          };
        }
      }
    } catch (err) {
      return err;
    }
  };

  loginValidationGithub = async (loginEmail) => {
    const item_found = await userModel.findOne({ email: loginEmail });

    if (!item_found) {
      return {
        status: "error",
        stateMsj: "No se a econtrado un usuario",
        ok: false,
        item_found: false,
      };
    }
    return {
      status: "ok",
      stateMsj: "Usuario encotrado",
      ok: true,
      item_found,
    };
  };

  changeStatus = async (uid, newStatus) => {
    const foundAndUpdate = await userModel.updateOne(
      { _id: uid },
      { status: newStatus },
      { new: true }
    );

    if (!foundAndUpdate) {
      return {
        status: "error",
        statusMsj: "Ha ocurrido un error al buscar y acutualizar el usuario",
        ok: false,
        data: undefined,
      };
    }

    return {
      status: "ok",
      statusMsj: "Usuario actualizado con exito",
      ok: true,
      data: foundAndUpdate,
    };
  };
}

module.exports = UserManager;
