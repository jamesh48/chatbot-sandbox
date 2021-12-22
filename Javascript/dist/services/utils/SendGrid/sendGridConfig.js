"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
const sendEmail = (_to, validationLink, channelsToJoin, username, callback) => {
    const _subject = "Verify your email with the Danny Goldsmith Magic Discord!";
    const msg = {
        to: _to,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: _subject,
        html: `<div style="display: block; background-color: lightblue; border: 1px solid black; text-align: center; padding: 0 2.5%; font-size: 1.5vmax;">
              <p>Hello, a request was made by user <strong>${username}</strong> to enable your purchased products from ${process.env.WIX_WEBSITE_URL} exclusive chatrooms in the discord guild.</p>
              <strong>If you did not make this request, please ignore this email and/or contact an admin</strong>
              <p>Otherwise, please click the button below to validate your purchased products with Discord and gain access to their respective exclusive channels:</p>
              <p style="border-bottom: 1px solid black; width: 50%; margin: 1.5% auto;">${channelsToJoin}</p>
              <a href='${validationLink}'>
                <input type='button' value='Validate'style="background-color: blue; color: ivory; padding: 1.5% 2.5%; cursor: pointer;"/>
              </a>
              <div>
                <p>Best...</p>
                <p>Magic Wand</p>
              </div>
           <div>`
    };
    sgMail.send(msg).then(() => {
        callback(`I sent you an email, with a link to secure your access to these channels: ${channelsToJoin}
                  Exisiting channels will remain enabled.`);
    }, (error) => {
        if (error.response) {
            console.error(error.response.body);
            callback("I'm sorry, I was unable to send a verification e-mail");
        }
    });
};
exports.default = sendEmail;
//# sourceMappingURL=sendGridConfig.js.map