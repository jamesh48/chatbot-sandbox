"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({ path: require("path").resolve(".env") });
const node_fetch_1 = __importDefault(require("node-fetch"));
const index_1 = __importDefault(require("../index"));
const axios = require("axios");
const express = require("express");
const app = express();
app.get("/authorizeCode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    if (code && process.env.CLIENT_SECRET && process.env.CLIENT_ID) {
        try {
            const oAuthResult = yield (0, node_fetch_1.default)("https://discord.com/api/oauth2/token", {
                method: "POST",
                body: new URLSearchParams({
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    code: code,
                    grant_type: "authorization_code",
                    redirect_uri: "http://localhost:3500/authorizeCode",
                    scope: "email"
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            const oAuthData = yield oAuthResult.json();
            const userResult = yield (0, node_fetch_1.default)("https://discord.com/api/users/@me", {
                headers: {
                    authorization: `${oAuthData.token_type} ${oAuthData.access_token}`
                }
            });
            console.log("<--- USER RESULT --->");
            const candidateUser = yield userResult.json();
            try {
                const { data: { message } } = yield axios({
                    method: "GET",
                    url: "https://dannygoldsmithmagic.com/_functions-dev/usersRegisteredProducts",
                    params: { discordId: candidateUser.id, email: candidateUser.email },
                    headers: {
                        Authorization: process.env.WIX_API_KEY
                    }
                });
                const theGuild = index_1.default.client.guilds.cache.get(process.env.GOLDSMITH_GUILD_ID || "");
                if (theGuild) {
                    const memberRole = theGuild.roles.cache.get("882026168558157865");
                    const newUserRole = theGuild.roles.cache.get("914633712711376937");
                    const memberToGrantAccess = theGuild.members.cache.get(candidateUser.id);
                    const purchasedProductArr = message
                        .map((x) => x.toLowerCase())
                        .join(", ");
                    theGuild.roles.cache.forEach((role) => {
                        if (purchasedProductArr.indexOf(role.name.toLowerCase()) > -1) {
                            memberToGrantAccess === null || memberToGrantAccess === void 0 ? void 0 : memberToGrantAccess.roles.add(role.id);
                        }
                    });
                    if (memberRole && memberToGrantAccess && newUserRole) {
                        memberToGrantAccess.roles.add(memberRole);
                        memberToGrantAccess.roles.remove(newUserRole);
                    }
                    const registrationChannel = theGuild.channels.cache.get("914738363767074876");
                    if (registrationChannel) {
                        const registrationChannelMessages = yield registrationChannel.messages.fetch();
                        registrationChannelMessages.forEach((msg) => __awaiter(void 0, void 0, void 0, function* () {
                            if (msg.embeds.length &&
                                msg.embeds[0].description &&
                                msg.embeds[0].description.indexOf(candidateUser.id) > -1) {
                                yield msg.delete();
                            }
                        }));
                    }
                }
                res.send("<script>window.close();</script>");
            }
            catch ({ response: { data: { error } = { error: "UNDEFINED" } } }) {
                throw new Error(error);
            }
        }
        catch (err) {
            console.error(JSON.stringify(err));
            return res.send("<script>window.close();</script>");
        }
    }
    return res.end();
}));
app.listen(process.env.EXPRESS_PORT, () => console.log(`Express-Discord listening on port ${process.env.EXPRESS_PORT}`));
//# sourceMappingURL=server.js.map