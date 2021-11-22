const axios = require("axios");
const path = require("path");
const { validateEmail, processCommandArgs } = require("./validationUtils.js");
const {
  helpCommand,
  registerCommand,
  revokeCommand,
  unsubscribeCommand,
  pingPongCommand,
  coinFlipCommand
} = require(path.resolve("command-lib/commandIndex.js"));

module.exports = async (receivedMessage, theGuild, validatedMember) => {
  const [primaryCommand, args] = processCommandArgs(receivedMessage);

  const emailCommands = /(enablechannelaccess|unsubscribe|revoke)/;
  if (emailCommands.test(primaryCommand)) {
    const email = validateEmail(args && args[0]);

    if (primaryCommand === "enablechannelaccess") {
      await registerCommand(theGuild, validatedMember, email);
    } else if (primaryCommand === "unsubscribe") {
      unsubscribeCommand(theGuild, validatedMember, email);
    } else if (primaryCommand === "revoke") {
      await revokeCommand(theGuild, validatedMember, email);
    }
    return;
  }

  if (primaryCommand === "help") {
    await helpCommand(validatedMember, args);
  } else if (primaryCommand === "ping") {
    await pingPongCommand(validatedMember);
  } else if (primaryCommand === "coinflip") {
    await coinFlipCommand(validatedMember)
  } else {
    validatedMember.send("Unknown command, try `!help`");
  }
};
