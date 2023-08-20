const { initServer } = require("./src/server");
const { cpus } = require("os");

const cluster = require("cluster");

console.log(cluster.isPrimary);
const numeroDeProcesadores = cpus().length;
console.log(
  "cantidad de hilos de ejecucion de mi procesador",
  numeroDeProcesadores
);

if (cluster.isPrimary) {
  console.log("Proceso primario generado proceso trabajador");
  for (let i = 0; i < numeroDeProcesadores; i++) {
    cluster.fork();
  }
  cluster.on("message", (worker) => {
    console.log(`El worker ${worker.process.id} dice ${worker.message}`);
  });
} else {
  console.log(
    "al no ser un proceso forkeado no cuento como primario,por lo tanto isPrimary ne falso,soy un walker"
  );
  initServer();
}
