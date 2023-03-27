const fs = require("fs");
const { addListener } = require("process");

const IdGenerator = () => {
  return Date.now();
};

const checkID = (id) => {
  if (!id) {
    console.error("Deve ingresar un ID valido");
    return false;
  }
  if (typeof id === "string") {
    console.error("Deve ingresar un ID con valor numerico");
    return false;
  }
  return true;
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
      console.log(this.products);
      return products;
    } catch (err) {
      await fs.promises.writeFile(this.path, JSON.stringify([]), "utf-8");
      console.log(this.products);
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
    const newItemCreated = {
      id: IdGenerator(),
      ...data,
    };

    let products = await this.getProducts();
    products = JSON.parse(products);
    products.push(newItemCreated);
    await fs.promises.writeFile(this.path, JSON.stringify(products), "utf-8");
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

  // Listo
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

const productManager = new ProductManager();
