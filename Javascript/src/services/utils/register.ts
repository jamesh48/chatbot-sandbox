import axios, { AxiosRequestConfig } from "axios";

import {
  DMChannel,
  GuildMember,
  Message,
  NewsChannel,
  PartialDMChannel,
  TextChannel,
  ThreadChannel
} from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import sendEmail from "./SendGrid/sendGridConfig";
@injectable()
export class Register {
  private readonly WixWebsiteURL: string;
  private readonly WixAPIKey: string;
  private readonly BaseURL: string;
  private readonly ExpressPort: string;
  private readonly ChannelsRoute: string;
  constructor(
    @inject(TYPES.WixWebsiteURL) WixWebsiteURL: string,
    @inject(TYPES.WixAPIKey) WixAPIKey: string,
    @inject(TYPES.BaseURL) BaseURL: string,
    @inject(TYPES.ExpressPort) ExpressPort: string,
    @inject(TYPES.ChannelsRoute) ChannelsRoute: string
  ) {
    this.WixWebsiteURL = WixWebsiteURL;
    this.WixAPIKey = WixAPIKey;
    this.BaseURL = BaseURL;
    this.ExpressPort = ExpressPort;
    this.ChannelsRoute = ChannelsRoute;
  }
  public async registerUser(
    memberToRegister: GuildMember,
    channel:
      | TextChannel
      | PartialDMChannel
      | DMChannel
      | NewsChannel
      | ThreadChannel,
    email: string | false
  ): Promise<void | Message<boolean>> {
    if (!email) {
      return channel.send("Invalid Email, Please try again");
    }

    const randTokenConfig: AxiosRequestConfig = {
      method: "POST",
      url: `${this.WixWebsiteURL}/_functions/randomToken?email=${email}`,
      headers: {
        Authorization: this.WixAPIKey
      }
    };

    try {
      const {
        data: { tempRandToken, channelsToJoin }
      }: AxiosRequestConfig = await axios(randTokenConfig);

      const validationLink = `${this.BaseURL}:${this.ExpressPort}/${this.ChannelsRoute}?discordId=${memberToRegister.user.id}&email=${email}&tempRandToken=${tempRandToken}`;

      const sendMsgCallback: (msg: string) => void = (msg) => {
        channel.send(msg);
      };

      return sendEmail(
        email,
        validationLink,
        channelsToJoin,
        memberToRegister.user.username,
        sendMsgCallback
      );
    } catch ({
      message,
      // Todo: Make a fallback
      response: {
        data: { error }
      }
    }) {
      if (error) {
        return channel.send(`Trying ${email}... \n ${error}`);
      }
      return channel.send(message);
    }
  }
}
