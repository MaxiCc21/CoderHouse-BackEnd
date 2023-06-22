const fs = require("fs");
const { cartModel } = require("../models/cart.model");

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
      let myRes = await cartModel.find().lean();
      return myRes;
    } catch (err) {
      console.log(err.stateMsj);
    }
  };

  getItemById = async (itemID) => {
    try {
      const found = await cartModel.find({ _id: itemID }).lean();
      return found;
    } catch (err) {
      console.log("A occurido un error");
    }
  };

  // addItem = async (cid, pid, body) => {
  //   let carts = await this.getItem();
  //   try {
  //     const found = await this.getItemById(cid);
  //     if (!found) throw { error: "Errors" };
  //     found.products.push({ id: pid, ...body });

  //     let updateCarts = carts.map((el) => (el.id === cid ? found : el));
  //     await fs.promises.writeFile(
  //       this.path,
  //       JSON.stringify(updateCarts),
  //       "utf-8"
  //     );
  //     return {
  //       status: "ok",
  //       statusMsj: "El Porducto fue agregado satisfactoriamente ",
  //     };
  //   } catch (err) {}
  // };

  createNewCart = async (uid) => {
    const cartData = {
      id_user_to_cart: uid,
    };

    try {
      await cartModel.create(cartData);
      return { state: "ok", statusMsj: "Se a creado un carrido" };
    } catch (err) {
      return { state: "error", statusMsj: "Se aproducido un error", err };
    }
  };

  // Agregar un item al carrito
  addItem = async (cid, pid, body) => {
    try {
      const cart = await cartModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      );
      console.log(cart, "cartttt");
      if (!cart) {
        const cart = await cartModel.findOneAndUpdate(
          { _id: cid },
          { $addToSet: { products: { product: body, quantity: 1, body } } },
          { new: true }
        );
        return cart;
      }
      return cart;
    } catch (error) {
      console.log(`Error agregando producto al carrito: ${error.message}`);
    }
  };
}

module.exports = CartManager;
