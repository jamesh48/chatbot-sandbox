const path = require("path");
const revokeCommand = require(path.resolve(__dirname, "revokeCommand.js"));

module.exports = async (
  theGuild,
  memberToKick,
  memberEmail
) => {
  if (!memberToKick.kickable)
    return memberToKick.send(
      "MagicWand has insufficient permissions to unsubscribe you. Contact an Admin please"
    );

  await revokeCommand(theGuild, memberToKick, memberEmail);
  await memberToKick.send("Goodbye!");

  try {
    await memberToKick.kick('Unsubscribe')
  } catch(err) {
    await memberToKick.send(err.message);
  }
};
