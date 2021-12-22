import { Guild, GuildMember } from "discord.js";

export const validateMember = (theGuild: Guild, receivedAuthorId: string) => {
  let validatedMember;

  theGuild.members.cache.forEach((member: GuildMember) => {
    if (member.user.id === receivedAuthorId) {
      validatedMember = member;
    }
  });

  if (!validatedMember) {
    throw new Error("You are not part of the guild");
  } else {
    return validatedMember;
  }
};
