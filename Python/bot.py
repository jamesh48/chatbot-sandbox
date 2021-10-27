import random
from discord.ext import commands
import discord


help_command = commands.DefaultHelpCommand(
  no_category = 'Commands'
)
bot = commands.Bot(
  command_prefix= "!",
  case_insensitive = True,
  description = "Welcome to my Chat bot! You can pass any of the following commands by prefixing '!' to the command, happy sailing!",
  help_command = help_command
  )

