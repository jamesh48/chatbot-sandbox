
require('dotenv');
const path = require('path');

let keyPath = path.resolve('python-chat-bot.pem')
module.exports = {
  apps: [{
    name: 'chatbot-sandbox',
    script: path.resolve('main.py'),
    interpreter: 'python3'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: process.env.EC2_HOST,
      key: keyPath,
      ref: 'origin/main'  ,
      repo: 'git@github.com:jamesh48/chatbot-sandbox.git',
      path: '/home/ubuntu/chatbot-sandbox',
      'post-deploy': 'pm2 startOrRestart ecosystem.config.js'
    }
  }
}