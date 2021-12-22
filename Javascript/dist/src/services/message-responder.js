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
exports.MessageResponder = void 0;
const ping_finder_1 = require("./ping-finder");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const register_1 = require("./utils/register");
const validateRegistrationChannel_1 = require("./validateRegistrationChannel");
const validateEmail_1 = require("./utils/validationUtils/validateEmail");
let MessageResponder = class MessageResponder {
    constructor(pingFinder, validateRegistrationChannel, register) {
        this.pingFinder = pingFinder;
        this.register = register;
        this.validateRegistrationChannel = validateRegistrationChannel;
    }
    handle(message, validatedMember) {
        return __awaiter(this, void 0, void 0, function* () {
            const registrationChannelTest = this.validateRegistrationChannel.isRegistrationChannel(message.channelId);
            if (!registrationChannelTest) {
                return Promise.reject();
            }
            const validatedEmail = (0, validateEmail_1.validateEmail)(message.content);
            yield this.register.registerUser(validatedMember, message.channel, validatedEmail);
            if (this.pingFinder.isPing(message.content)) {
                return message.reply("pong!");
            }
            return Promise.reject();
        });
    }
};
MessageResponder = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PingFinder)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ValidateRegistrationChannel)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.Register)),
    __metadata("design:paramtypes", [ping_finder_1.PingFinder,
        validateRegistrationChannel_1.ValidateRegistrationChannel,
        register_1.Register])
], MessageResponder);
exports.MessageResponder = MessageResponder;
//# sourceMappingURL=message-responder.js.map