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

  loginValidation = async (identification, password) => {
    try {
      const found = await userModel.findOne({
        $or: [{ username: identification }, { email: identification }],
      });
      if (!found) {
        throw { status: "error", statusMsj: "No se a econtrado un usuario" };
      } else {
        if (found.password === password) {
          return {
            status: "ok",
            statusMsj: "Bienvenido",
            username: found.username,
          };
        } else {
          return { status: "err", statusMsj: "La contraseña es incorrecta" };
        }
      }
    } catch (err) {
      return err;
    }
  };
}

module.exports = UserManager;
