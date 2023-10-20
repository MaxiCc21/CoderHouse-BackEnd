const { initServer } = require("./src/server");
const { cpus } = require("os");

const cluster = require("cluster");
const { logger } = require("./src/middlewares/logger");

initServer();
