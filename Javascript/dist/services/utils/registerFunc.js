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
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const path = require("path");
const axios = require("axios");
const sendEmail = require(path.resolve("sendGridConfig.js"));
const register = function (memberToRegister, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const randTokenConfig = {
            method: "POST",
            url: `${process.env.WIX_WEBSITE_URL}/_functions/randomToken?email=${email}`,
            headers: {
                Authorization: process.env.WIX_API_KEY || ""
            }
        };
        try {
            var { data: { tempRandToken, channelsToJoin } } = yield axios(randTokenConfig);
        }
        catch ({ message, response: { data: { error } } }) {
            console.log(message);
            return memberToRegister.send(error || message);
        }
        const validationLink = `${process.env.BASE_URL}:${process.env.EXPRESS_PORT}/${process.env.CHANNELS_ROUTE}?discordId=${memberToRegister.user.id}&email=${email}&tempRandToken=${tempRandToken}`;
        const sendMsgCallback = (msg) => {
            memberToRegister.send(msg);
        };
        sendEmail(email, validationLink, channelsToJoin, memberToRegister.user.username, sendMsgCallback);
    });
};
exports.register = register;
//# sourceMappingURL=registerFunc.js.map