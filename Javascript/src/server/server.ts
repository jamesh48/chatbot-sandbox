require("dotenv").config({ path: require("path").resolve(".env") });
import { Response } from "express";
import fetch from "node-fetch";
import bot from "../index";
const axios = require("axios");
import { Message } from "discord.js";
import express = require("express");
import { AxiosResponse } from "axios";
const app = express();

app.get("/authorizeCode", async (req: any, res: Response) => {
  const { code } = req.query;

  if (code && process.env.CLIENT_SECRET && process.env.CLIENT_ID) {
    try {
      const oAuthResult = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",

        // @ts-ignore
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

      const oAuthData = await oAuthResult.json();

      const userResult = await fetch("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${oAuthData.token_type} ${oAuthData.access_token}`
        }
      });

      console.log("<--- USER RESULT --->");
      const candidateUser = await userResult.json();
      try {
        const {
          data: { message }
        }: AxiosResponse = await axios({
          method: "GET",
          url: "https://dannygoldsmithmagic.com/_functions-dev/usersRegisteredProducts",
          params: { discordId: candidateUser.id, email: candidateUser.email },
          headers: {
            Authorization: process.env.WIX_API_KEY
          }
        });

        const theGuild = bot.client.guilds.cache.get(
          process.env.GOLDSMITH_GUILD_ID || ""
        );

        if (theGuild) {
          const memberRole = theGuild.roles.cache.get(
            /*Member Role*/ "882026168558157865"
          );

          const newUserRole = theGuild.roles.cache.get(
            /*New User Role*/ "914633712711376937"
          );
          const memberToGrantAccess = theGuild.members.cache.get(
            candidateUser.id
          );

          const purchasedProductArr = message
            .map((x: string) => x.toLowerCase())
            .join(", ");

          theGuild.roles.cache.forEach((role) => {
            if (purchasedProductArr.indexOf(role.name.toLowerCase()) > -1) {
              memberToGrantAccess?.roles.add(role.id);
            }
          });

          if (memberRole && memberToGrantAccess && newUserRole) {
            memberToGrantAccess.roles.add(memberRole);
            memberToGrantAccess.roles.remove(newUserRole);
          }

          const registrationChannel: any =
            theGuild.channels.cache.get("914738363767074876");

          if (registrationChannel) {
            const registrationChannelMessages =
              await registrationChannel.messages.fetch();

            registrationChannelMessages.forEach(async (msg: Message) => {
              if (
                msg.embeds.length &&
                msg.embeds[0].description &&
                msg.embeds[0].description.indexOf(candidateUser.id) > -1
              ) {
                await msg.delete();
              }
            });
          }
        }
        res.send("<script>window.close();</script>");
      } catch ({ response: { data: { error } = { error: "UNDEFINED" } } }) {
        throw new Error(error);
      }
    } catch (err) {
      console.error(JSON.stringify(err));
      return res.send("<script>window.close();</script>");
    }
  }

  return res.end();
});

app.listen(process.env.EXPRESS_PORT, () =>
  console.log(`Express-Discord listening on port ${process.env.EXPRESS_PORT}`)
);
