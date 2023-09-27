const { Command } = require("commander");
const commander = new Command();

commander.option("--mode <mode>", "Modo de trabajo", "development").parse();

console.log(commander.opts());

module.exports = commander;
