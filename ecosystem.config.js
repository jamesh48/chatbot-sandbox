module.exports = {
  apps: [{
    name: 'discord-chatbot',
    script: './Javascript/dist/server/server.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-50-19-133-107.compute-1.amazonaws.com',
      key: './Login/discord-chatbot.pem',
      ref: 'origin/main',
      repo: 'git@github.com:jamesh48/chatbot-sandbox.git',
      path: '/home/ubuntu/chatbot-sandbox',
      'post-deploy': 'cd Javascript && npm install && pm2 startOrRestart ../ecosystem.config.js'
    }
  }
}