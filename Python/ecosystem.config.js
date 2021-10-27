
const path = require('path');
let keyPath = path.resolve('python-chat-bot.pem')
module.exports = {
  apps: [{
    name: 'chatbot-sandbox',
    script: path.resolve('main.py')
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-52-15-36-81.us-east-2.compute.amazonaws.com',
      key: keyPath,
      ref: 'origin/main'  ,
      repo: 'git@github.com:jamesh48/chatbot-sandbox.git',
      path: '/home/ubuntu',
      'post-deploy': 'pm2 startOrRestart ecosystem.config.js'
    }
  }
}