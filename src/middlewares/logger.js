const winston = require("winston");

const customLevelOptioms = {
  level: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "blue",
    debug: "white",
  },
};

const logger = winston.createLogger({
  levels: customLevelOptioms.level,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({
          colors: customLevelOptioms.colors,
        }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "warning",
      format: winston.format.simple(),
    }),
  ],
});

const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.info(
    `${req.method} en ${req.url} - ${new Date().toLocaleTimeString}`
  );
  next();
};

module.exports = {
  logger,
  addLogger,
};
