from bot import bot
import discord
import html
import json
from functools import reduce
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



#Roll Dice Command
@bot.command(name='roll_dice', help='Simulates the rolling of dice.')
async def roll(ctx, number_of_dice: int, number_of_sides: int):
  dice = [
    str(random.choice(range(1, number_of_sides + 1)))
    for _ in range(number_of_dice)
  ]
  await ctx.send(', '.join(dice))

#Trivia Command (API Example)
def addQuestions(x, y):
  return x + "\n\n" + y['question']

@bot.command(
  name='trivia',
  brief='Sends a list of true/false Trivia Questions!',
  description=f"By default sends 1 easy question about animals \n\n To specify... \n\n Pass a number of trivia questions from 1-10 as first parameter, \n\n the difficulty level of 'easy', 'medium' or 'hard' for the second parameter \n\n and one of the numbers corresponding to the following categories... \n 'Any Category' - empty \n 'General Knowledge' - 9 \n 'Books' - 10 \n 'Film' - 11 \n 'Music' - 12 \n 'Musical & Theaters' - 13 \n 'Television' - 14 \n 'Video-Games' - 15 \n 'Board-Games' - 16 \n 'Science & Nature' - 17 \n 'Computers' - 18 \n 'Mathematics' - 19 \n 'Mythology' - 20 \n 'Sports' - 21 \n 'Geography' - 22 \n 'History' - 23 \n 'Politics' - 24 \n 'Art' - 25 \n 'Celebrities' - 26 \n 'Animals' - 27 \n 'Vehicles' - 28 \n 'Comics' - 29 'Gadgets' - 30 \n 'Japanese Anime & Manga' - 31 \n 'Cartoons & Animations' - 32 \n -Provided by Open Trivia Database | https://opentdb.com/ "
  )
async def trivia(ctx, no_of_questions = 1, difficulty = 'easy', category = 0):
  if (category == 0):
    category = random.randint(9, 32)

  result = requests.get(f'https://opentdb.com/api.php?amount={no_of_questions}&category={category}&difficulty={difficulty}&type=boolean')

  aList = result.json()['results']
  reduced = reduce(addQuestions, aList[1:], aList[0]['question'])

  await ctx.send(html.unescape(reduced))

#Ping Pong Command
@bot.command(name='ping', help='Lets play a game...')
async def pong(ctx):
  print(ctx)
  await ctx.message.add_reaction('🏓')
  msg =  await ctx.send('PONG!')
  # ...add reaction to own message
  # await msg.add_reaction('🏓')





