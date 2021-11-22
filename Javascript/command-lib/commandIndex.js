const path = require("path");
const revokeCommand = require(path.resolve(__dirname, "revokeCommand.js"));
const unsubscribeCommand = require(path.resolve(
  __dirname,
  "unsubscribeCommand.js"
));
const registerCommand = require(path.resolve(__dirname, "registerCommand.js"));
const enableChannels = require(path.resolve(__dirname, "enableChannels.js"));
const pingPongCommand = require(path.resolve(__dirname, "pingPongCommand.js"));
const coinFlipCommand = require(path.resolve(__dirname, "coinFlipCommand.js"));
const helpCommand = require(path.resolve(__dirname, "helpCommand.js"));

module.exports = {
  revokeCommand,
  unsubscribeCommand,
  registerCommand,
  enableChannels,
  pingPongCommand,
  coinFlipCommand,
  helpCommand,
};
