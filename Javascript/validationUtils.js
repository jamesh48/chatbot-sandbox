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
  // Confirm that it is in the correct channel, otherwise don't respond.
  console.log(receivedMessage);
  return;
};

module.exports.processCommandArgs = (receivedMessage) => {
  const fullCommand = receivedMessage.content.substr(1);
  const splitCommand = fullCommand.split(" ");
  const primaryCommand = splitCommand[0].toLowerCase();
  const args = splitCommand.slice(1);
  return [primaryCommand, args];
};
