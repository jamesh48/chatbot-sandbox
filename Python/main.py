import os
import random
from discord.ext.commands.core import command
from dotenv import load_dotenv
import Handlers.bot_events
import Handlers.bot_commands

#1
import discord
from discord.ext import commands
from bot import bot
load_dotenv()

TOKEN = os.getenv('DISCORD_TOKEN')

bot.run(TOKEN)

