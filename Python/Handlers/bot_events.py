from bot import bot
from discord.ext import commands

@bot.event
async def on_ready():
  print(f'{bot.user.name} has connected to Discord!')

@bot.event
async def on_command_error(ctx, error):
  if isinstance(error, commands.errors.CheckFailure):
    await ctx.send('You do not have the correct role for this command')

