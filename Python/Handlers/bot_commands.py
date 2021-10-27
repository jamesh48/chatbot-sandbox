from bot import bot
import discord
import requests
from discord.ext import commands
import random

#Brooklyn 99 Command
@bot.command(name='99', help='Responds with a random quote from brooklyn 99')
async def nine_nine(ctx):

  brooklyn_99_quotes = [
        'I\'m the human form of the 💯 emoji.',
        'Bingpot!',
        (
            'Cool. Cool cool cool cool cool cool cool, '
            'no doubt no doubt no doubt no doubt.'
        ),
    ]

  response = random.choice(brooklyn_99_quotes)
  await ctx.send(response)

# Create Channel Command
@bot.command(name='create-channel')
@commands.has_role('admin')
async def create_channel(ctx, channel_name='real-python'):
    guild = ctx.guild
    existing_channel = discord.utils.get(guild.channels, name=channel_name)
    if not existing_channel:
        print(f'Creating a new channel: {channel_name}')
        await guild.create_text_channel(channel_name)

#Roll Dice Command
@bot.command(name='roll_dice', help='Simulates the rolling of dice.')
async def roll(ctx, number_of_dice: int, number_of_sides: int):
  dice = [
    str(random.choice(range(1, number_of_sides + 1)))
    for _ in range(number_of_dice)
  ]
  await ctx.send(', '.join(dice))

#Trivia Command
@bot.command(name='trivia', help='Sends a Trivia Question about animals!')
async def trivia(ctx):
  r = requests.get('https://opentdb.com/api.php?amount=1&category=27&difficulty=easy&type=boolean')
  test = r.json()['results'][0]['question']

  await ctx.send(test)
