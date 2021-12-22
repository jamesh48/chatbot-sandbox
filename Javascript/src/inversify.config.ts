import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { Bot } from "./bot";
import { Client, Intents } from "discord.js";
import { MessageResponder } from "./services/message-responder";

import { PingFinder } from "./services/ping-finder";
import { ValidateRegistrationChannel } from "./services/validateRegistrationChannel";
import { Register } from "./services/utils/register";

let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(
  new Client({
    partials: ["CHANNEL"],
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.DIRECT_MESSAGES,
      // Bot only responds to DM's for now
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_BANS
    ]
  })
);
container
  .bind<string>(TYPES.Token)
  .toConstantValue(process.env.BOT_SECRET_TOKEN || "");

container
  .bind<string>(TYPES.GuildID)
  .toConstantValue(process.env.GOLDSMITH_GUILD_ID || "");

container
  .bind<string>(TYPES.RegistrationChannelID)
  .toConstantValue(process.env.REGISTRATION_CHANNEL_ID || "");

container
  .bind<string>(TYPES.DiscordAuthorizeURI)
  .toConstantValue(process.env.DISCORD_AUTHORIZE_URI|| "");
container
  .bind<string>(TYPES.BaseURL)
  .toConstantValue(process.env.BASE_URL || "");

container
  .bind<string>(TYPES.ExpressPort)
  .toConstantValue(process.env.EXPRESS_PORT || "");

container
  .bind<string>(TYPES.WixWebsiteURL)
  .toConstantValue(process.env.WIX_WEBSITE_URL || "");

container
  .bind<string>(TYPES.ChannelsRoute)
  .toConstantValue(process.env.CHANNELS_ROUTE || "");

container
  .bind<string>(TYPES.WixAPIKey)
  .toConstantValue(process.env.WIX_API_KEY || "");

container
  .bind<MessageResponder>(TYPES.MessageResponder)
  .to(MessageResponder)
  .inSingletonScope();

container.bind<PingFinder>(TYPES.PingFinder).to(PingFinder).inSingletonScope();
container.bind<Register>(TYPES.Register).to(Register).inSingletonScope();

container
  .bind<ValidateRegistrationChannel>(TYPES.ValidateRegistrationChannel)
  .to(ValidateRegistrationChannel)
  .inSingletonScope();

export default container;
