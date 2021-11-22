require('dotenv').config()
const path = require('path');
const client = require("./2Sides.js");
const express = require("express");
const app = express();
const { enableChannels } = require(path.resolve(
  __dirname,
  "command-lib/commandIndex.js"
));

const { validateMember } = require(path.resolve(
  __dirname,
  "validationUtils.js"
));

app.get(`/${process.env.CHANNELS_ROUTE}`, async (req, res) => {
  const theGuild = await client.guilds.cache.get(
    process.env.GOLDSMITH_GUILD_ID
  );

  try {
    var validatedMember = await validateMember(theGuild, req.query.discordId);
  } catch (err) {
    const test = await client.fetchUser(req.query.discordId);
    console.log(test);
    test.send("you aren't in the guild anymore!")
    return res.send("invalid member");
  }

  const {
    query: { email, discordId, tempRandToken },
  } = req;

  await enableChannels(
    theGuild,
    validatedMember,
    email,
    discordId,
    tempRandToken
  );
  res.redirect(process.env.DISCORD_CHATBOT_REDIRECT_LINK);
});

app.listen(process.env.EXPRESS_PORT, () =>
  console.log(`Express-Discord listening on port ${process.env.EXPRESS_PORT}`)
);
