import { GuildMember, Message } from "discord.js";
import { PingFinder } from "./ping-finder";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { Register } from "./utils/register";
import { ValidateRegistrationChannel } from "./validateRegistrationChannel";
import { validateEmail } from "./utils/validationUtils/validateEmail";

@injectable()
export class MessageResponder {
  private pingFinder: PingFinder;
  private validateRegistrationChannel: ValidateRegistrationChannel;
  private register: Register;

  constructor(
    @inject(TYPES.PingFinder) pingFinder: PingFinder,
    @inject(TYPES.ValidateRegistrationChannel)
    validateRegistrationChannel: ValidateRegistrationChannel,
    @inject(TYPES.Register) register: Register
  ) {
    this.pingFinder = pingFinder;
    this.register = register;
    this.validateRegistrationChannel = validateRegistrationChannel;
  }

  async handle(
    message: Message,
    validatedMember: GuildMember
  ): Promise<Message | Message[]> {
    const registrationChannelTest =
      this.validateRegistrationChannel.isRegistrationChannel(message.channelId);

    if (!registrationChannelTest) {
      return Promise.reject();
    }
    // Validate Email first
    const validatedEmail = validateEmail(message.content);

    await this.register.registerUser(validatedMember, message.channel, validatedEmail);

    if (this.pingFinder.isPing(message.content)) {
      return message.reply("pong!");
    }

    return Promise.reject();
  }
}
