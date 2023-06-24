const fs = require("fs");
const { cartModel } = require("../models/cart.model");
const { log } = require("console");

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

  getItemToCart = async (uid) => {
    try {
      const found = await cartModel.findOne({ id_user_to_cart: uid }).lean();
      if (!found) {
        return {
          status: "error",
          statusMsj: "No se encotrado un carrito con dicho ID",
          ok: false,
          data: null,
        };
      }
      return {
        status: "ok",
        statusMsj: "Se econtro el carrito",
        ok: true,
        data: found.products,
      };

      return products;
    } catch (err) {
      return { status: "error", statusMsj: `error:${err}` };
    }

    return found;
  };

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

  createNewCart = async (uid) => {
    const cartData = {
      id_user_to_cart: uid,
    };

    try {
      const cart = await cartModel.findOne({ id_user_to_cart: uid });
      if (!cart) {
        await cartModel.create(cartData);
        return { state: "ok", statusMsj: "Se a creado un carrido" };
      }
    } catch (err) {
      return { state: "error", statusMsj: "Se aproducido un error", err };
    }
  };

  // Agregar un item al carrito
  addItem = async (cid, pid, body) => {
    try {
      const cart = await cartModel.findOneAndUpdate(
        { id_user_to_cart: cid, "products.product._id": pid },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      );
      console.log("inc quantity");

      if (!cart) {
        const cart = await cartModel.findOneAndUpdate(
          { id_user_to_cart: cid },
          { $addToSet: { products: { product: body, quantity: 1 } } },
          { new: true }
        );
        console.log("Add product");
        console.log(cart);
        return cart;
      }
      return cart;
    } catch (error) {
      console.log(`Error agregando producto al carrito: ${error.message}`);
    }
  };
}

module.exports = CartManager;
