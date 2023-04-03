import fs from "fs";

const IdGenerator = () => {
  return Date.now();
};

const checkObjectKeys = (obj) => {
  if (
    !obj.title ||
    !obj.description ||
    !obj.price ||
    !obj.thumbnail ||
    !obj.stock
  ) {
    return {
      state: "error",
      msgState: "Todos los campos son obligatorios",
    };
  }
  {
    return { state: "ok", msgState: "Campos validados" };
  }
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

export class ProductManager {
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
    let products = await this.getProducts();
    products = JSON.parse(products);
    const found = products.find(({ id }) => id === itemID);
    found
      ? console.log(found)
      : console.error(`No se a encontrado un producto con el id (${itemID})`);

    return found;
  };

  addProduct = async (data) => {
    let res = checkObjectKeys(data);
    if (res.state === "error") {
      console.log(res.msgState);
    } else {
      let newItemCreated = {
        id: IdGenerator(),
        ...data,
      };

      let code = codeGenerator(objeto);

      newItemCreated = {
        ...newItemCreated,
        ...code,
      };
      let products = await this.getProducts();
      products = JSON.parse(products);
      products.push(newItemCreated);
      await fs.promises.writeFile(this.path, JSON.stringify(products), "utf-8");
    }
  };

  updateProduct = async (id, data) => {
    let products = await this.getProducts();
    products = JSON.parse(products);

    let newData = products.map((el) =>
      el.id === id
        ? { ...el, ...data }
        : (console.error(`No se a encotrado ningun producto con ID(${id})`), el)
    );

    await fs.promises.writeFile(this.path, JSON.stringify(newData), "utf-8");
  };

  deleteProduct = async (id) => {
    let filterDb = await this.getProducts();
    if (filterDb === "[]") {
      console.error(`El producto con ID (${id}) no existe`);
    } else {
      filterDb = JSON.parse(filterDb);
      filterDb = filterDb.filter((el) => el.id !== id);

      await fs.promises.writeFile(this.path, JSON.stringify(filterDb), "utf-8");
    }
  };
}
