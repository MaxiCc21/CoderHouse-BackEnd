const { EError } = require("../utils/CustomError/EErrors");

exports.errorHandler = (error, req, res, next) => {
  console.log(error.cause);

  switch (error.code) {
    case EError.INVALID_TYPE_ERROR:
      return res.send({ status: "error", error: error.name });
      break;
    case EError.DATABASE_ERROR:
      return res.send({ status: "error", error: error.name });
      break;
    case EError.ROUTING_ERROR:
      return res.send({ status: "error", error: error.name });
      break;

    default:
      return res.send({ status: "error", error: "Unhadler error" });
      break;
  }
};
