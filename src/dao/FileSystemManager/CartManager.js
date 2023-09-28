const fs = require("fs");

const IdGenerator = () => {
  return Date.now();
};

const checkItemsKeys = (obj) => {
  if (
    !obj.title ||
    !obj.description ||
    !obj.price ||
    !obj.thumbnail ||
    !obj.stock ||
    !obj.categoy
  ) {
    return {
      state: "error",
      msgState: "Todos los campos son obligatorios",
    };
  }

  if (typeof obj.title !== "string") {
    return {
      state: "error",
      msgState: "Uno de los tipo de dato es incorrecto",
    };
  }

  return {
    state: 200,
    stateMsj: "OK",
    message: "Campos validados",
    error: false,
  };
};

class CartManager {
  constructor() {
    this.path = "./carts.json";
    this.items = [];
  }

  getItem = async () => {
    try {
      let items = await fs.promises.readFile(this.path, "utf-8");
      items ? (this.items = await JSON.parse(items)) : (this.items = []);

      return JSON.parse(items);
    } catch (err) {
      await fs.promises.writeFile(this.path, JSON.stringify([]), "utf-8");
    }
  };

  getItemById = async (itemID) => {
    let items = await this.getItem();
    const found = items.find(({ id }) => id === itemID);
    found
      ? found
      : console.error(`No se a encontrado un producto con el id (${itemID})`);

    return found;
  };

  addItem = async (data) => {
    let newItemCreated = {
      id: IdGenerator(),
      ...data,
    };
    let newCart = { id: IdGenerator(), products: newItemCreated };

    let products = await this.getItem();

    products.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(products), "utf-8");
    return {
      status: "ok",
      statusMsj: "El Porducto fue agregado satisfactoriamente ",
    };
  };

  addItem = async (cid, pid, body) => {
    let carts = await this.getItem();
    try {
      const found = await this.getItemById(cid);
      if (!found) throw { error: "Errors" };
      found.products.push({ id: pid, ...body });

      let updateCarts = carts.map((el) => (el.id === cid ? found : el));
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(updateCarts),
        "utf-8"
      );
      return {
        status: "ok",
        statusMsj: "El Porducto fue agregado satisfactoriamente ",
      };
    } catch (err) {}
  };

  createNewCart = async () => {
    let newCart = {
      id: IdGenerator(),
      products: [],
    };
    let carts = await this.getItem();
    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
    return {
      status: "ok",
      statusMsj: "Se agrego un carrito correctamente ",
    };
  };
}

module.exports = CartManager;
