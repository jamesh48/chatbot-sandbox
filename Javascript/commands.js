module.exports = {
  processCommand: (receivedMessage) => {
    const fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0].toLowerCase();
    let arguments = splitCommand.slice(1);

    if (primaryCommand === 'help') {
      module.exports.helpCommand(arguments, receivedMessage);
    } else if (primaryCommand === 'multiply') {
      module.exports.multiplyCommand(arguments, receivedMessage);
    } else if (primaryCommand === 'ping') {
      module.exports.pingPongCommand(receivedMessage)
    }else {
      receivedMessage.channel.send("Unknown command, try `!help` or `!multiply 5 10`")
    }
  },
  helpCommand: (args, receivedMessage) => {
    if (args.length === 0) {
      receivedMessage.channel.send("I'm not sure what you need help with, try... '!help [topic]'")
    } else {
      receivedMessage.channel.send("It looks like you need help with... " + args.join(' '))
    }
  },

  pingPongCommand: (receivedMessage) => {
    receivedMessage.react('🏓')
    receivedMessage.channel.send('PONG!');
  },

  multiplyCommand: (args, receivedMessage) => {
    if (args.length < 2) {
      receivedMessage.channel.send("Not enough arguments, Try `!multiply 5 10`");
    }
    const result = args.reduce((total, num) => {
        return total * parseFloat(num)
    }, 1);
    receivedMessage.channel.send(`The product of ${args.join(', ')} is ${result}`)
  }
}