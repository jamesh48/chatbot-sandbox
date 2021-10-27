require("dotenv").config();
const Discord = require("discord.js");
const { Client, Intents } = require("discord.js");
const { processCommand } = require("./commands.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  // Verb- Playing, Streaming, Listening, Watching
  client.user.setActivity("with self", { type: "PLAYING" });

  // client.guilds.cache.forEach((guild) => {
  // guild.channels.cache.forEach((channel) => {
  // console.log(` - ${channel.name} ${channel.type} ${channel.id}`)
  // });
  // });

  // const generalChannel = client.channels.cache.get(
  //   process.env.GENERAL_CHANNEL_ID
  // );
  // const attachment =
  //   "https://static.fullstackhrivnak.com/main/main-images/GES.jpg";
  // generalChannel
  //   .send({
  //     files: [{ attachment: attachment }],
  //   })
  //   .catch(console.error);
});

client.on("message", (receivedMessage) => {
  if (receivedMessage.author === client.user) {
    return;
  }

  receivedMessage.channel.send(
    "Message received: " +
      receivedMessage.author.toString() +
      ": " +
      receivedMessage.content
  );

  if (receivedMessage.content.startsWith("!")) {
    processCommand(receivedMessage);
  }
});

const bot_secret_token = process.env.BOT_SECRET_TOKEN;

client.login(bot_secret_token);
