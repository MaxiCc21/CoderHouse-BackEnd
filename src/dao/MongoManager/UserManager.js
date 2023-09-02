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
    } catch (err) {
      console.log(err.stateMsj);
    }
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
    } catch (err) {
      console.log(err.stateMsj);
    }
  };

  getUserByID = async (idToFind) => {
    let users = await this.getAllUser();
    const found = users.find(({ id }) => id === idToFind);
    found
      ? found
      : console.error(`No se a encontrado un producto con el id (${idToFind})`);

    return found;
  };

  createNewUser = async (data) => {
    try {
      let create = await userModel.create(data);
      return {
        status: "ok",
        statusMsj: "Se agrego un usuario correctamente ",
      };
    } catch (err) {
      return false;
    }
  };

  deletUser = async (idToDelete) => {
    console.log(idToDelete);
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
}

module.exports = UserManager;
