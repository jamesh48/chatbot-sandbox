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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const axios_1 = __importDefault(require("axios"));
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const sendGridConfig_1 = __importDefault(require("./SendGrid/sendGridConfig"));
let Register = class Register {
    constructor(WixWebsiteURL, WixAPIKey, BaseURL, ExpressPort, ChannelsRoute) {
        this.WixWebsiteURL = WixWebsiteURL;
        this.WixAPIKey = WixAPIKey;
        this.BaseURL = BaseURL;
        this.ExpressPort = ExpressPort;
        this.ChannelsRoute = ChannelsRoute;
    }
    registerUser(memberToRegister, channel, email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                return channel.send("Invalid Email, Please try again");
            }
            const randTokenConfig = {
                method: "POST",
                url: `${this.WixWebsiteURL}/_functions/randomToken?email=${email}`,
                headers: {
                    Authorization: this.WixAPIKey
                }
            };
            try {
                const { data: { tempRandToken, channelsToJoin } } = yield (0, axios_1.default)(randTokenConfig);
                const validationLink = `${this.BaseURL}:${this.ExpressPort}/${this.ChannelsRoute}?discordId=${memberToRegister.user.id}&email=${email}&tempRandToken=${tempRandToken}`;
                const sendMsgCallback = (msg) => {
                    channel.send(msg);
                };
                return (0, sendGridConfig_1.default)(email, validationLink, channelsToJoin, memberToRegister.user.username, sendMsgCallback);
            }
            catch ({ message, response: { data: { error } } }) {
                if (error) {
                    return channel.send(`Trying ${email}... \n ${error}`);
                }
                return channel.send(message);
            }
        });
    }
};
Register = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.WixWebsiteURL)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.WixAPIKey)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.BaseURL)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ExpressPort)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.ChannelsRoute)),
    __metadata("design:paramtypes", [String, String, String, String, String])
], Register);
exports.Register = Register;
//# sourceMappingURL=register.js.map