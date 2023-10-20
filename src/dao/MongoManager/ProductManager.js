const fs = require("fs");
const { productModel } = require("../models/product.model");
const { ObjectId } = require("bson");
const { tr } = require("@faker-js/faker");
const { logger } = require("../../middlewares/logger");

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
  constructor() {
    this.productModel = productModel;
  }

  getAllProducts = async () => {
    try {
      let myRes = await this.productModel.find().lean();
      return myRes;
    } catch (err) {
      logger.error(err.stateMsj);
    }
  };

  getProductById = async (itemID) => {
    try {
      const found = await this.productModel.findOne({ _id: itemID }).lean();
      return found;
    } catch (err) {
      logger.error(err);
    }
  };

  getProductsByCategory = async (category) => {
    try {
      const foundProductsForCategory = await this.productModel
        .find({
          "category.0": category,
        })
        .lean();

      if (foundProductsForCategory.length == 0) {
        return {
          status: "error",
          statusMsj: "No se an encotrado los productos",
          ok: false,
          data: undefined,
        };
      }
      return {
        status: "ok",
        statusMsj: `Se an encotrado los productos con categoria ${category}`,
        ok: true,
        data: foundProductsForCategory,
      };
    } catch (err) {
      return {
        status: "error",
        statusMsj: "Ah ocurrido un error inesperado",
        ok: false,
        data: undefined,
      };
    }
  };

  getProductByUserID = async (ownerID) => {
    try {
      const allMyProducts = await this.productModel
        .find({ "owner.ownerID": ownerID })
        .lean();

      if (!allMyProducts) {
        return {
          status: "error",
          statusMsj: "No se an encotrado productos asociados a tu usuario",
          ok: false,
          data: undefined,
        };
      }

      return {
        status: "ok",
        statusMsj: "Se an econtrado esto productos",
        ok: true,
        data: allMyProducts,
      };
    } catch (err) {
      return { err };
    }
  };

  createProduct = async (data) => {
    try {
      const createNewProduct = this.productModel.create(data);
      if (!createNewProduct) {
        return {
          status: 401,
          statusMsj: "Ha ocurrido un erro al crear un nuevo producto",
          ok: false,
          data: undefined,
        };
      }

      return {
        status: 200,
        statusMsj: "Producto creado con exito",
        ok: true,
        data: undefined,
      };
    } catch (err) {
      return err;
    }
  };

  deleteProductByID = async (productID) => {
    try {
      const deleteProduct = await this.productModel.findByIdAndRemove({
        _id: productID,
      });

      if (!deleteProduct) {
        return {
          status: 404,
          statusMsj: "No a sido posible eliminar el producto",
          ok: false,
          data: undefined,
        };
      }

      return {
        status: 204,
        statusMsj: "Producto eliminado con exito",
        ok: true,
        data: undefined,
      };
    } catch (err) {
      return {
        status: 500,
        statusMsj: err,
        ok: false,
        data: undefined,
      };
    }
  };

  updateProduct = async (pid, newData) => {
    try {
      const updateProduct = await this.productModel.findOneAndUpdate(
        {
          _id: pid,
        },
        { $set: newData }
      );

      if (!updateProduct) {
        return {
          status: 404,
          statusMsj: "No ah sido posible actualizar el producto",
          ok: false,
          data: undefined,
        };
      }
      return {
        status: 200,
        statusMsj: "Producto actualizado correctamente",
        ok: true,
        data: updateProduct,
      };
    } catch (err) {
      return err;
    }
  };

  addProduct = async (data) => {
    try {
      const createNewProduct = await this.productModel.create(data);

      if (!createNewProduct) {
        return {
          status: 400,
          statusMsj: "No ha sido posible actualizar el producto",
          ok: false,
          data: undefined,
        };
      }

      return {
        status: 201,
        statusMsj: "Se ha creado el  producto exitosamente",
        ok: true,
        data: undefined,
      };
    } catch (err) {
      return err;
    }
  };

  getProductPaginator = async (page, limit) => {
    try {
      const product = await this.productModel.paginate(
        {},
        { page, limit, lean: true }
      );
      return product;
    } catch (err) {}
  };
}

module.exports = HandleProducts;
