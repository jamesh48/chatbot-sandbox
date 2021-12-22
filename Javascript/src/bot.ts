import { Client, GuildMember, Message, MessageEmbed } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { MessageResponder } from "./services/message-responder";
import { validateMember } from "./services/utils/validationUtils/validateMember";

@injectable()
export class Bot {
  public client: Client;
  private readonly token: string;
  private messageResponder: MessageResponder;
  private readonly GuildID: string;
  private readonly registrationChannelID: string;
  private readonly discordAuthorizeURI: string;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.MessageResponder) messageResponder: MessageResponder,
    @inject(TYPES.GuildID) GuildID: string,
    @inject(TYPES.RegistrationChannelID) registrationChannelID: string,
    @inject(TYPES.DiscordAuthorizeURI) discordAuthorizeURI: string
  ) {
    this.client = client;
    this.token = token;
    this.messageResponder = messageResponder;
    this.GuildID = GuildID;
    this.registrationChannelID = registrationChannelID;
    this.discordAuthorizeURI = discordAuthorizeURI;
  }

  public listen(): Promise<string> {
    this.client.on("messageCreate", (message: Message) => {
      if (message.author.bot) {
        console.log("Ignoring bot message!");
        return;
      }
      // Change to injectable...
      const theGuild = this.client.guilds.cache.get(this.GuildID);

      if (theGuild) {
        const validatedMember = validateMember(theGuild, message.author.id);

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

    this.client.on("guildMemberAdd", async (_member: GuildMember) => {
      // const incomingDiscordID = member.user.id;
      const theGuild = this.client.guilds.cache.get(this.GuildID);
      if (theGuild) {
        const registrationChannel = theGuild.channels.cache.get(
          this.registrationChannelID
        );

        if (registrationChannel) {
          // Timeout because it takes 5-10 seconds for discord to load
          setTimeout(async () => {
            //https://discordjs.guide/popular-topics/embeds.html#embed-preview
            const authorizeEmbed = new MessageEmbed()
              .setColor("#47d115")
              .setTitle("Authorize Access")
              .setAuthor("Magic Wand")
              .setURL(this.discordAuthorizeURI)
              .setDescription(
                "Please verify that the email that you use for discord is the same you bought dannygoldsmithmagic.com products with before clicking, if not please contact an admin"
              )
              .setFooter("By the way, you are awesome")
              .setTimestamp();

            //@ts-ignore
            await registrationChannel.send({ embeds: [authorizeEmbed] });
          }, 25000);
        }
      }
    });

    return this.client.login(this.token);
  }
}
