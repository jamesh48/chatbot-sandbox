from bot import bot
import discord
import html
import json
from functools import reduce
import requests
from discord.ext import commands
import random
from flask import Flask
app = Flask('')


@app.route('/hello', methods=['*'])
def my_command():
  return 'hello'


# with app.app_context():
#   test = json.dumps({
#       "content": "This is a message with components",
#       "components": [
#           {
#               "type": 1,
#               "components": []
#           }
#       ]
#   })

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
def craftQuestion(question, type):
  result = ""
  if (question['type'] == 'boolean'):
    result = result + "Type: True/False \n"
  else:
    result = result + "Type: Multiple Choice \n"

  result = result + f"    Question: {question['question']} \n"

  if (type == 'multiple'):
    try:

      shuffledAnswers = question['incorrect_answers']
      shuffledAnswers.append(question['correct_answer'])
      random.shuffle(shuffledAnswers)
      # shuffledAnswers = random.shuffle(shuffledAnswers)
      print(shuffledAnswers)
      result = result + '\n'.join(shuffledAnswers)
    except Exception as e:
      print(e)

  result = result + f"       Answer: ||{question['correct_answer']}||"
  return result

def addQuestions(x, y):
  return x + "\n\n" + craftQuestion(y)


@bot.command(
  name='trivia',
  brief='Sends a list of true/false Trivia Questions!',
  description=f"By default sends 1 easy question about animals \n\n To specify... \n\n Pass a number of trivia questions from 1-10 as first parameter, \n\n the difficulty level of 'easy', 'medium' or 'hard' for the second parameter \n\n and one of the numbers corresponding to the following categories... \n 'Any Category' - empty \n 'General Knowledge' - 9 \n 'Books' - 10 \n 'Film' - 11 \n 'Music' - 12 \n 'Musical & Theaters' - 13 \n 'Television' - 14 \n 'Video-Games' - 15 \n 'Board-Games' - 16 \n 'Science & Nature' - 17 \n 'Computers' - 18 \n 'Mathematics' - 19 \n 'Mythology' - 20 \n 'Sports' - 21 \n 'Geography' - 22 \n 'History' - 23 \n 'Politics' - 24 \n 'Art' - 25 \n 'Celebrities' - 26 \n 'Animals' - 27 \n 'Vehicles' - 28 \n 'Comics' - 29 'Gadgets' - 30 \n 'Japanese Anime & Manga' - 31 \n 'Cartoons & Animations' - 32 \n -Provided by Open Trivia Database | https://opentdb.com/ "
  )
async def trivia(ctx, no_of_questions = 1, difficulty = 0, category = 0, type: str = '0'):
  # if Category is undefined, choose a random Category
  if (category == 0):
    category = random.randint(9, 32)
  if (difficulty == 0):
    difficulty = random.choice(['easy', 'medium', 'hard'])
  if (type == '0'):
    type = random.choice(['boolean', 'multiple'])


  # API Call for Questions
  questionList = requests.get(f'https://opentdb.com/api.php?amount={no_of_questions}&category={category}&difficulty={difficulty}&type={type}').json()['results']
  #Begin Crafting Response
  formattedQuestionsHeaderStr = f"__**Welcome to Trivia Time!**__ \n     Your category is... **{questionList[0]['category']}** \n     Your difficulty is... **{questionList[0]['difficulty']}** \n\n"

  #Format Questions into a user Friendly String
  formattedQuestionsStr = html.unescape(reduce(addQuestions, questionList[1:], craftQuestion(questionList[0], type)))
  response = formattedQuestionsHeaderStr + formattedQuestionsStr
  # Send to Client
  await ctx.send(response)

#Ping Pong Command
@bot.command(name='ping', help='Lets play a game...')
async def pong(ctx):
  print(ctx)
  await ctx.message.add_reaction('🏓')
  msg =  await ctx.send('PONG!')
  # ...add reaction to own message
  # await msg.add_reaction('🏓')





