"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const inversify_1 = require("inversify");
const types_1 = require("./types");
const message_responder_1 = require("./services/message-responder");
const validateMember_1 = require("./services/utils/validationUtils/validateMember");
let Bot = class Bot {
    constructor(client, token, messageResponder, GuildID, registrationChannelID, discordAuthorizeURI) {
        this.client = client;
        this.token = token;
        this.messageResponder = messageResponder;
        this.GuildID = GuildID;
        this.registrationChannelID = registrationChannelID;
        this.discordAuthorizeURI = discordAuthorizeURI;
    }
    listen() {
        this.client.on("messageCreate", (message) => {
            if (message.author.bot) {
                console.log("Ignoring bot message!");
                return;
            }
            const theGuild = this.client.guilds.cache.get(this.GuildID);
            if (theGuild) {
                const validatedMember = (0, validateMember_1.validateMember)(theGuild, message.author.id);
                this.messageResponder
                    .handle(message, validatedMember)
                    .then(() => {
                    console.log("Response sent!");
                })
                    .catch(() => {
                    console.log("Response not sent.");
                });
            }
        });
        this.client.on("guildMemberAdd", (_member) => __awaiter(this, void 0, void 0, function* () {
            const theGuild = this.client.guilds.cache.get(this.GuildID);
            if (theGuild) {
                const registrationChannel = theGuild.channels.cache.get(this.registrationChannelID);
                if (registrationChannel) {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        const authorizeEmbed = new discord_js_1.MessageEmbed()
                            .setColor("#47d115")
                            .setTitle("Authorize Access")
                            .setAuthor("Magic Wand")
                            .setURL(this.discordAuthorizeURI)
                            .setDescription("Please verify that the email that you use for discord is the same you bought dannygoldsmithmagic.com products with before clicking, if not please contact an admin")
                            .setFooter("By the way, you are awesome")
                            .setTimestamp();
                        yield registrationChannel.send({ embeds: [authorizeEmbed] });
                    }), 25000);
                }
            }
        }));
        return this.client.login(this.token);
    }
};
Bot = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Client)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.Token)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.MessageResponder)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.GuildID)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.RegistrationChannelID)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.DiscordAuthorizeURI)),
    __metadata("design:paramtypes", [discord_js_1.Client, String, message_responder_1.MessageResponder, String, String, String])
], Bot);
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map