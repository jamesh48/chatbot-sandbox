module.exports.validateEmail = (email) => {
  if (!email) {
    throw new Error("Please include an email for this command");
  }
  return email;
};

module.exports.validateMember = (theGuild, receivedAuthorId) => {
  let validatedMember;
  theGuild.members.cache.forEach((member) => {
    if (member.user.id === receivedAuthorId) {
      validatedMember = member;
    }
  });

  if (!validatedMember) {
    throw new Error("You are not part of the guild");
  } else {
    return validatedMember;
  }
};

module.exports.confirmReceivedMessage = async (receivedMessage) => {
  if (receivedMessage.content.startsWith("!")) {
    await receivedMessage.channel.send(
      "Message received: " +
        receivedMessage.author.toString() +
        ": " +
        receivedMessage.content
    );
  } else {
    throw new Error(`Please prefix your query with a !
                      -For a full list of available queries send !help`);
  }
};

module.exports.processCommandArgs = (receivedMessage) => {
  const fullCommand = receivedMessage.content.substr(1);
  const splitCommand = fullCommand.split(" ");
  const primaryCommand = splitCommand[0].toLowerCase();
  const args = splitCommand.slice(1);
  return [primaryCommand, args];
};
