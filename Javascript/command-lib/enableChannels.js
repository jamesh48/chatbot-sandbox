require("dotenv").config();
const axios = require("axios");

const grantAccessToPrivateChannels = async (
  theGuild,
  userToRegister,
  purchasedProductArr
) => {
  await theGuild.channels.cache.reduce(async (promise, channel) => {
    await promise;
    const currChannelName = channel.name.toLowerCase();

    if (purchasedProductArr.join(", ").indexOf(currChannelName) > -1) {
      await channel.permissionOverwrites.create(userToRegister, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
      });
    }
  }, Promise.resolve());
};

module.exports = async (
  theGuild,
  memberToRegister,
  userEmail,
  discordId,
  tempRandToken
) => {
  const getUsersRegisteredProductsConfig = {
    url: `${process.env.WIX_WEBSITE_URL}/_functions/usersRegisteredProducts?email=${userEmail}&discordId=${discordId}&tempRandToken=${tempRandToken}`,
    headers: {
      Authorization: process.env.WIX_API_KEY,
    },
  };

  try {
    const {
      data: { message: purchasedProductArr },
    } = await axios(getUsersRegisteredProductsConfig);

    const purchasedProductsToLowerCase = purchasedProductArr.map(
      (purchasedProductName) => purchasedProductName.toLowerCase()
    );

    await grantAccessToPrivateChannels(
      theGuild,
      memberToRegister,
      purchasedProductsToLowerCase
    );

    await memberToRegister.send(
      `Access Granted: ${purchasedProductArr.join(", ")}`
    );
  } catch (err) {
    console.log(error);
    memberToRegister.send(`${err.message}: ${err.response.data.error}`);
  }
};
