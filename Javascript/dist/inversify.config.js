"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("./types");
const bot_1 = require("./bot");
const discord_js_1 = require("discord.js");
const message_responder_1 = require("./services/message-responder");
const ping_finder_1 = require("./services/ping-finder");
const validateRegistrationChannel_1 = require("./services/validateRegistrationChannel");
const register_1 = require("./services/utils/register");
let container = new inversify_1.Container();
container.bind(types_1.TYPES.Bot).to(bot_1.Bot).inSingletonScope();
container.bind(types_1.TYPES.Client).toConstantValue(new discord_js_1.Client({
    partials: ["CHANNEL"],
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_PRESENCES,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
        discord_js_1.Intents.FLAGS.GUILD_BANS
    ]
}));
container
    .bind(types_1.TYPES.Token)
    .toConstantValue(process.env.BOT_SECRET_TOKEN || "");
container
    .bind(types_1.TYPES.GuildID)
    .toConstantValue(process.env.GOLDSMITH_GUILD_ID || "");
container
    .bind(types_1.TYPES.RegistrationChannelID)
    .toConstantValue(process.env.REGISTRATION_CHANNEL_ID || "");
container
    .bind(types_1.TYPES.DiscordAuthorizeURI)
    .toConstantValue(process.env.DISCORD_AUTHORIZE_URI || "");
container
    .bind(types_1.TYPES.BaseURL)
    .toConstantValue(process.env.BASE_URL || "");
container
    .bind(types_1.TYPES.ExpressPort)
    .toConstantValue(process.env.EXPRESS_PORT || "");
container
    .bind(types_1.TYPES.WixWebsiteURL)
    .toConstantValue(process.env.WIX_WEBSITE_URL || "");
container
    .bind(types_1.TYPES.ChannelsRoute)
    .toConstantValue(process.env.CHANNELS_ROUTE || "");
container
    .bind(types_1.TYPES.WixAPIKey)
    .toConstantValue(process.env.WIX_API_KEY || "");
container
    .bind(types_1.TYPES.MessageResponder)
    .to(message_responder_1.MessageResponder)
    .inSingletonScope();
container.bind(types_1.TYPES.PingFinder).to(ping_finder_1.PingFinder).inSingletonScope();
container.bind(types_1.TYPES.Register).to(register_1.Register).inSingletonScope();
container
    .bind(types_1.TYPES.ValidateRegistrationChannel)
    .to(validateRegistrationChannel_1.ValidateRegistrationChannel)
    .inSingletonScope();
exports.default = container;
//# sourceMappingURL=inversify.config.js.map