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
    console.log(products);

    products.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(products), "utf-8");
    return {
      status: "ok",
      statusMsj: "El Porducto fue agregado satisfactoriamente ",
    };
  };

  addItem = async (cid, pid, body) => {
    let carts = await this.getItem();
    let res = await this.getItemById(cid);
    let newItemCreated = {
      id: pid,
      ...body,
    };

    let newItemToCart = res.products;
    newItemToCart.push(newItemCreated);

    res = {
      ...res,
      products: {
        ...res.products,
        ...newItemToCart,
      },
    };

    let newData = carts.map((el) =>
      el.id === Number(cid) ? res : console.log("err")
    );
    console.log(newData, "???");
    // let newUpdateItem = {
    //   ...res,
    //   products: { ...res.products, ...newItemCreated },
    // };

    //   let products = await this.getItem();
    // products = JSON.parse(products);
    // products.push(newItemCreated);
    await fs.promises.writeFile(this.path, JSON.stringify(newData), "utf-8");
    return {
      status: "ok",
      statusMsj: "El Porducto fue agregado satisfactoriamente ",
    };
  };
}

module.exports = CartManager;
