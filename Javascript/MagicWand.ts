require("dotenv").config();
import { Response } from "express";
import bot from "./src/index";
const axios = require("axios");
import { Message } from "discord.js";
import express = require("express");
import { AxiosResponse } from "axios";
const app = express();

app.get("/ping", (req: any, res: Response) => {
  console.log("PING");
  res.send("pong");
});

app.get("/authorizeCode", async (req: any, res: Response) => {
  console.log("AUTHORIZE CODE");
  const { code } = req.query;

  if (code) {
    try {
      const oAuthResult = await fetch("https://discord.com/api/oauth2/token", {
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

      const oAuthData = await oAuthResult.json();

      const userResult = await fetch("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${oAuthData.token_type} ${oAuthData.access_token}`
        }
      });

      console.log("<--- USER RESULT --->");
      const candidateUser = await userResult.json();
      console.log(candidateUser.email);
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

        console.log("access granted");

        const theGuild = bot.client.guilds.cache.get(
          process.env.GOLDSMITH_GUILD_ID
        );
        const memberRole = theGuild.roles.cache.get(
          /*Member Role*/ "882026168558157865"
        );

        const newUserRole = theGuild.roles.cache.get(
          /*New User Role*/ "914633712711376937"
        );
        const memberToGrantAccess = theGuild.members.cache.get(
          candidateUser.id
        );

        memberToGrantAccess.roles.add(memberRole);
        memberToGrantAccess.roles.remove(newUserRole);

        const registrationChannel =
          theGuild.channels.cache.get("914738363767074876");

        const registrationChannelMessages: any =
          await registrationChannel.fetch();

        await registrationChannelMessages.forEach(async (msg: Message) => {
          if (msg.embeds.length) {
            if (msg.embeds[0].description.indexOf(candidateUser.id) > -1) {
              await msg.delete();
            }
          }
        });

        res.send("<script>window.close();</script>");
      } catch ({
        response: {
          data: { error }
        }
      }) {
        throw new Error(error);
      }
    } catch (err) {
      console.error(JSON.stringify(err));
      return res.send("<script>window.close();</script>");
    }
  }

  res.end();
});

app.listen(process.env.EXPRESS_PORT, () =>
  console.log(`Express-Discord listening on port ${process.env.EXPRESS_PORT}`)
);
