const { userModel } = require("./dao/models/user.model");

const fs = require("fs");

class UserManager {
  constructor() {
    this.path = "./user.json";
  }

  getAllUser = async () => {
    try {
      let users = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(users);
    } catch (err) {
      await fs.promises.writeFile(this.path, JSON.stringify([]), "utf-8");
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
    console.log(data);
    await userModel.create(data);
    return {
      status: "ok",
      statusMsj: "Se agrego un usuario correctamente ",
    };
  };

  deletUser = async (idToDelete) => {
    let users = await this.getAllUser();

    if (users === "[]") {
      return {
        status: "Error",
        statusMsj: "No hay ningun producto",
      };
    }

    const found = users.find(({ id }) => id === idToDelete);
    if (!found) {
      return {
        status: "Error",
        statusMsj: `No se encontro ninung producto con ID(${idToDelete})`,
      };
    } else {
      let filterDb = users.filter(({ id }) => id !== idToDelete);

      await fs.promises.writeFile(this.path, JSON.stringify(filterDb), "utf-8");
      return {
        status: "ok",
        statusMsj: `Se elimino producto satisfactoriamente`,
      };
    }
  };
}

module.exports = UserManager;

const LLL = new UserManager();
LLL.getAllUser();
