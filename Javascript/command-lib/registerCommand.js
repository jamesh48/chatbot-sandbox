const path = require("path");
const axios = require("axios");
const sendEmail = require(path.resolve("sendGridConfig.js"));

module.exports = async (theGuild, memberToRegister, email) => {
  const randTokenConfig = {
    method: 'POST',
    url: `${process.env.WIX_WEBSITE_URL}/_functions/randomToken?email=${email}`,
    headers: {
      Authorization: process.env.WIX_API_KEY,
    },
  };

  try {
    var {
      data: { tempRandToken, channelsToJoin },
    } = await axios(randTokenConfig);
  } catch ({
    message,
    // Todo: Make a fallback
    response: {
      data: { error },
    },
  }) {
    console.log(message);
    return memberToRegister.send(error || message);
  }

  const validationLink = `${process.env.BASE_URL}:${process.env.EXPRESS_PORT}/${process.env.CHANNELS_ROUTE}?discordId=${memberToRegister.user.id}&email=${email}&tempRandToken=${tempRandToken}`;

  const sendMsgCallback = (msg) => {
    memberToRegister.send(msg);
  };

  sendEmail(
    email,
    validationLink,
    channelsToJoin,
    memberToRegister.user.username,
    sendMsgCallback
  );
};
