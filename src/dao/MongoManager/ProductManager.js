const fs = require("fs");
const { productModel } = require("../models/product.model");
const { ObjectId } = require("bson");

const IdGenerator = () => {
  return Date.now();
};
//

class ProductManager {
  constructor() {
    this.path = "./db.json";
    this.products = [];
  }

  getProducts = async () => {
    try {
      let myRes = await productModel.find().lean();
      return myRes;
    } catch (err) {
      console.log(err.stateMsj);
    }
  };

  getProductById = async (itemID) => {
    console.log(itemID, "product");
    try {
      const found = await productModel.findOne({ _id: itemID }).lean();
      return found;
    } catch (err) {
      console.log(err);
    }
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

  deleteProduct = async (idToDelete) => {
    try {
      const user = await productModel.findByIdAndRemove(idToDelete);
    } catch (err) {
      return err;
    }
  };
}

module.exports = ProductManager;

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

class HandleProducts {
  // manager User
  constructor() {
    //  iniciar la base de datos
    this.productModel = productModel;
  }

  getProducts = async () => {
    try {
      let myRes = await this.productModel.find().lean();
      return myRes;
    } catch (err) {
      console.log(err.stateMsj);
    }
  };

  getProductById = async (itemID) => {
    try {
      const found = await this.productModel.find({ _id: itemID }).lean();
      return found;
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = HandleProducts;
