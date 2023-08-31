const { initServer } = require("./src/server");
const { cpus } = require("os");

const cluster = require("cluster");
const { logger } = require("./src/middlewares/logger");

logger.info(cluster.isPrimary);
const numeroDeProcesadores = cpus().length;
logger.info(
  "cantidad de hilos de ejecucion de mi procesador",
  numeroDeProcesadores
);

// if (cluster.isPrimary) {
//   logger.info("Proceso primario generado proceso trabajador");
//   for (let i = 0; i < numeroDeProcesadores; i++) {
//     cluster.fork();
//   }
//   cluster.on("message", (worker) => {
//     logger.info(`El worker ${worker.process.id} dice ${worker.message}`);
//   });
// } else {
//   logger.info(
//     "al no ser un proceso forkeado no cuento como primario,por lo tanto isPrimary ne falso,soy un walker"
//   );
//   initServer();
// }
initServer();
