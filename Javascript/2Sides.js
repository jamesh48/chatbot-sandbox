require("dotenv").config();
// -----------------------------------------------
const path = require("path");
const Discord = require("discord.js");
const { Client, Intents } = require("discord.js");
// -----------------------------------------------
const routeCommand = require(path.resolve("commandRouter.js"));

const { validateMember, confirmReceivedMessage } = require(path.resolve(
  "validationUtils.js"
));

const client = new Client({
  partials: ["CHANNEL"],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    // Bot only responds to DM's for now
    // Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
  ],
});

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  // Verb- Playing, Streaming, Listening, Watching
  client.user.setActivity("YouTube videos on self improvement", {
    type: "WATCHING",
  });

  const guild = client.guilds.cache.get(process.env.GOLDSMITH_GUILD_ID);
  // const bot = guild.roles.cache.find(
  //   (r) => r.name === "2Sides"
  // );
  // bot id =902597442615259187
  // guild.members.cache.each((member) => {
  //   // if (index === 4) {
  //   //   console.log(member.user);
  //   // }
  // });

  // client.guilds.cache.forEach((guild) => {
  //   guild.channels.cache.forEach((channel) => {
  //     console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
  //   });
  // });
});

client.on("guildMemberAdd", (member) => {
  const username = member.user.username;
  const userId = member.user.id;
  client.users.cache.get(userId).send(
    `Welcome to the Guild ${username}!!

    If you have purchased additional products (or will in the future) from ${process.env.WIX_WEBSITE_URL}, you can join exclusive channels  for those products by telling me !enableChannelAccess <your-email> - replacing <your-email> with well, your email!

      Then i'll email you a link just to verify your identity, clicking that link will enable access to those exclusive rooms.

      Best

      -2Sides
      `
  );
});

client.on("messageCreate", async (receivedMessage) => {
  if (receivedMessage.author === client.user) return;
  const theGuild = client.guilds.cache.get(process.env.GOLDSMITH_GUILD_ID);

  try {
    var validatedMember = validateMember(theGuild, receivedMessage.author.id);
    await confirmReceivedMessage(receivedMessage);
  } catch (err) {
    return receivedMessage.channel.send(err.message);
  }

  try {
    await routeCommand(receivedMessage, theGuild, validatedMember);
  } catch (err) {
    validatedMember.send(err.message);
  }
});

client.login(process.env.BOT_SECRET_TOKEN);

module.exports = client;
