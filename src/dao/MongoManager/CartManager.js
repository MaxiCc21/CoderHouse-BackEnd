const fs = require("fs");
const { cartModel } = require("../models/cart.model");
const { log } = require("console");
const { ObjectId } = require("bson");

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
    this.cartModel = cartModel;
  }

  getItemToCart = async (uid) => {
    try {
      const found = await this.cartModel
        .findOne({ id_user_to_cart: uid })
        .lean();
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
    } catch (err) {
      return { status: "error", statusMsj: `error:${err}` };
    }
  };

  deleteItemToCart = async (uid, pid) => {
    pid = new ObjectId(pid);
    try {
      const cart = await this.cartModel
        .findOneAndUpdate(
          { id_user_to_cart: uid, "products.product._id": pid },
          { $inc: { "products.$.quantity": -1 } },
          { new: true }
        )
        .lean();

      const cartDeleteProduct = await this.cartModel
        .findOneAndUpdate(
          { id_user_to_cart: uid, "products.product._id": pid },
          { $pull: { products: { "product._id": pid, quantity: 0 } } },
          { new: true }
        )
        .lean();

      return {
        status: "Ok",
        statusMsj: "Se elimino una unidad del peoducto",
        ok: true,
        data: null,
      };
    } catch (error) {
      return {
        status: "error",
        statusMsj: `Error agregando producto al carrito: ${error.message}`,
        ok: false,
        data: null,
      };
    }
  };
  addItemToCart = async (uid, pid) => {
    console.log(uid, pid);
    pid = new ObjectId(pid);
    try {
      const cart = await this.cartModel
        .findOneAndUpdate(
          { id_user_to_cart: uid, "products.product._id": pid },
          { $inc: { "products.$.quantity": 1 } },
          { new: true }
        )
        .lean();

      return {
        status: "Ok",
        statusMsj: "Se agrego una unidad del peoducto",
        ok: true,
        data: null,
      };
    } catch (error) {
      return {
        status: "error",
        statusMsj: `Error agregando producto al carrito: ${error.message}`,
        ok: false,
        data: null,
      };
    }
  };

  getItem = async () => {
    try {
      let myRes = await this.cartModel.find().lean();
      return myRes;
    } catch (err) {
      console.log(err.stateMsj);
    }
  };

  getItemById = async (itemID) => {
    try {
      const found = await this.cartModel.find({ _id: itemID }).lean();
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
      const cart = await this.cartModel.findOne({ id_user_to_cart: uid });
      if (!cart) {
        await this.cartModel.create(cartData);
        return {
          state: "ok",
          statusMsj: "Se a creado un carrido",
          ok: true,
          data: undefined,
        };
      }
      return {
        state: "ok",
        statusMsj: "Todo piola con el carrito",
        ok: true,
        data: undefined,
      };
    } catch (err) {
      return {
        state: "error",
        statusMsj: `Se aproducido un error: ${err}`,
        ok: false,
        data: undefined,
      };
    }
  };

  // Agregar un item al carrito
  addItem = async (cid, pid, body) => {
    try {
      const cart = await this.cartModel.findOneAndUpdate(
        { id_user_to_cart: cid, "products.product._id": pid },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      );

      if (!cart) {
        const cart = await this.cartModel.findOneAndUpdate(
          { id_user_to_cart: cid },
          { $addToSet: { products: { product: body, quantity: 1 } } },
          { new: true }
        );
        return {
          status: "ok",
          statusMsj: "Se agrego el producto al carrito",
          ok: true,
          data: null,
        };
      }
      return {
        status: "ok",
        statusMsj: "Se agrego un producto",
        ok: true,
        data: null,
      };
    } catch (err) {
      return {
        status: "error",
        statusMsj: `Error agregando producto al carrito: ${err}`,
        ok: false,
        data: null,
      };
    }
  };
  DeleteProduct = async (uid, pid) => {
    pid = new ObjectId(pid);
    console.log(uid, pid);
    try {
      const deleteAllProducts = await this.cartModel.findOneAndUpdate(
        { id_user_to_cart: uid },
        { $pull: { products: { "product._id": pid } } },
        { new: true }
      );
      if (!deleteAllProducts) {
        return {
          status: "error",
          statusMsj: `Error al buscar el carrito`,
          ok: false,
          data: null,
        };
      }
      return {
        status: "ok",
        statusMsj: `Producto eliminado del carrito`,
        ok: true,
        data: null,
      };
    } catch (err) {
      return {
        status: "error",
        statusMsj: `error:${err}`,
        ok: false,
        data: null,
      };
    }
  };
}

module.exports = CartManager;
