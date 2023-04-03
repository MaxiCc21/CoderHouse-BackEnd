import fs from "fs";

const IdGenerator = () => {
  return Date.now();
};

// const checkID = (id) => {
//   if (!id) {
//     console.error("Deve ingresar un ID valido");
//     return false;
//   }
//   if (typeof id === "string") {
//     console.error("Deve ingresar un ID con valor numerico");
//     return false;
//   }
//   return true;
// };

const checkObjectKeys = (obj) => {
  if (
    !obj.title ||
    !obj.description ||
    !obj.price ||
    !obj.thumbnail ||
    !obj.code ||
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

let objeto = {
  id: 1680374191231,
  title:
    "Smart TV Samsung Neo QLED 4K QN43QN90BAGCZB QLED Tizen 4K 43' 220V - 240V",
  description:
    "Con el Smart TV QN43QN90BAG vas a acceder a las aplicaciones en las que se encuentran tus contenidos favoritos. Además, podés navegar por Internet, interactuar en redes sociales y divertirte con videojuegos.",
  price: 334.999,
  thumbnail:
    "https://http2.mlstatic.com/D_NQ_NP_620893-MLA52321232150_112022-O.webp",
  code: "tectvSamsung231",
  categoy: ["tecnologías", "tv"],
  marca: "Samsung",
  stock: 7,
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
  code += String(obj.id).slice(10, 13);
  return code;
};
console.log(codeGenerator(objeto));

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
      return products;
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
    console.log(data);
    let res = checkObjectKeys(data);

    if (res.state === "error") {
      console.log(res.msgState);
    } else {
      const newItemCreated = {
        id: IdGenerator(),
        ...data,
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
