module.exports = async (user, args) => {
  if (args.length === 0) {
    await user.send(
      "I'm not sure what you need help with, try... '!help [topic]'"
    );
    setTimeout(async () => {
      await user.send(
        `Heres a list of commands you can use:
          !enableChannelAccess <your email>
            -Verify your email, and receive access to exclusive text and voice channels for purchased products from Danny.
                * Only need to do once, or after purchasing new products on ${process.env.WIX_WEBSITE_URL}
          !unsubscribe <your email>
            -This command will remove you from the guild, i'll be sure to double check before booting you.
                `
      );
    }, 2000);
  } else if (args[0].toLowerCase() === "enablechannelaccess") {
    await user.send(
      `This command connects your discord with your purchased products from Danny granting you exclusive access to rooms within the Guild. After running this command, I will check to see which products you have purchased, and then send you an email with a link to confirm that its really you!

        Clicking the link will grant you access to those specific rooms at no additional cost. If you purchase more products from Danny in the future, follow the exact same process to enable access to those additional rooms.
        `
    );
  } else if (args[0].toLowerCase() === "ping") {
    await user.send(`Shall we play a game of table tennis?`);
  } else {
    user.send("It looks like you need help with... " + args.join(" "));
  }
};
