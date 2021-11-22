require("dotenv").config();
const axios = require("axios");

const revokeAccessToAllPrivateChannels = async (theGuild, userToRevoke) => {
  // First Revoke Access to Channels on Discord Side
  const revokeArr = ["mythos", "homage", "modus"];
  try {
    await theGuild.channels.cache.reduce(async (promise, channel) => {
      await promise;
      const currChannelName = channel.name.toLowerCase();
      if (revokeArr.includes(currChannelName)) {
        await channel.permissionOverwrites.create(userToRevoke, {
          SEND_MESSAGES: false,
          VIEW_CHANNEL: false,
        });
      }
    }, Promise.resolve());
  } catch (err) {
    console.log(err.message);
  }
};

const revokeGuildAccessInWix = async (email, discordId) => {
  const revokeGuildAccessConfig = {
    method: "POST",
    url: `${process.env.WIX_WEBSITE_URL}/_functions/revokeGuildAccess?email=${email}&discordId=${discordId}`,
    headers: {
      authorization: process.env.WIX_API_KEY,
    },
  };

  await axios(revokeGuildAccessConfig);
};

module.exports = async (theGuild, memberToRevoke, memberEmail) => {
  try {
    // Then remove discord id on WIX side (requires email);
    // This should throw an error if email doesn't match
    await revokeGuildAccessInWix(memberEmail, memberToRevoke.user.id);
    // Revoke access to private channels (testing only)
    await revokeAccessToAllPrivateChannels(theGuild, memberToRevoke);

    await memberToRevoke.send('Permissions Revoked!');
  } catch (err) {
    return memberToRevoke.send(`${err.message}: ${err.response.data.error}`);
  }
};
