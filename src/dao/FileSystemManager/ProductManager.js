const fs = require("fs");

const IdGenerator = () => {
  return Date.now();
};

const checkObjectKeys = (obj) => {
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

  if (
    typeof obj.title !== "string" ||
    typeof obj.description !== "string" ||
    typeof obj.price !== "number" ||
    // typeof obj.status !== "boolean" ||
    typeof obj.thumbnail !== "string" ||
    typeof obj.stock !== "number" ||
    typeof obj.categoy !== "object"
  ) {
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

const codeGenerator = (obj) => {
  let code = "";
  const codeGenerator = obj.categoy.forEach((el) => {
    if (el.length <= 2) {
      code = code + el;
    } else {
      code += el.slice(0, 3);
    }
  });
  code += obj.marca;
  code += String(obj.id).slice(10, 13);
  return { code };
};

class ProductManager {
  constructor() {
    this.path = "./db.json";
    this.products = [];
  }

  getProducts = async () => {
    try {
      let products = await fs.promises.readFile(this.path, "utf-8");
      products
        ? (this.products = await JSON.parse(products))
        : (this.products = []);

      return JSON.parse(products);
    } catch (err) {
      await fs.promises.writeFile(this.path, JSON.stringify([]), "utf-8");
    }
  };

  getProductById = async (itemID) => {
    let products = this.products;
    const found = products.find(({ id }) => id === itemID);
    found
      ? console.log(found)
      : console.error(`No se a encontrado un producto con el id (${itemID})`);

    return found;
  };

  addProduct = async (data) => {
    let res = checkObjectKeys(data);
    if (res.state === "error") {
      return res.msgState;
    } else {
      let newItemCreated = {
        id: IdGenerator(),
        ...data,
      };
      let code = codeGenerator(newItemCreated);

      newItemCreated = {
        ...newItemCreated,
        ...code,
      };
      let products = await this.getProducts();
      // products = JSON.parse(products);
      products.push(newItemCreated);
      await fs.promises.writeFile(this.path, JSON.stringify(products), "utf-8");
      return {
        status: "ok",
        statusMsj: "El Porducto fue agregado satisfactoriamente ",
      };
    }
  };

  updateProduct = async (id, data) => {
    let products = await this.getProducts();

    let newData = products.map((el) =>
      el.id === Number(id) ? { ...el, ...data } : el
    );

    await fs.promises.writeFile(this.path, JSON.stringify(newData), "utf-8");
  };

  deleteProduct = async (deleteID) => {
    let products = await this.getProducts();

    if (products === "[]") {
      return {
        status: "Error",
        statusMsj: "No hay ningun producto",
      };
    }

    const found = products.find(({ id }) => id === deleteID);
    if (!found) {
      return {
        status: "Error",
        statusMsj: `No se encontro ninung producto con ID(${deleteID})`,
      };
    } else {
      let filterDb = products.filter(({ id }) => id !== deleteID);

      await fs.promises.writeFile(this.path, JSON.stringify(filterDb), "utf-8");
      return {
        status: "ok",
        statusMsj: `Se elimino producto satisfactoriamente`,
      };
    }
  };
}

module.exports = ProductManager;
