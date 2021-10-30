var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs')
const util = require('./bot-util')
const command = require('./bot-commands')
const xml = require('./bot-xml');
const { channel } = require('diagnostics_channel');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

let server

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('any', function (event) {
  /*if (nigChamber.length > 0) {
    userObject = server.members[nigChamber[0]]

    if (userObject.voice_channel_id != undefined && bot.voice_channel_id == undefined) {
      bot.joinVoiceChannel(userObject.voice_channel_id, function (error, events) {
        if (error) {
          return console.error(error);
        }

        events.on('speaking', function (userID, SSRC, speakingBool) {
          if (nigChamber.includes(userID)) {
            if (speakingBool) {
              logger.info('Gaz is speaking')
            }
          }
        })

        bot.getAudioContext(userObject.voice_channel_id, function (error, stream) {
          if (error) {
            return console.error(error)
          }

          fs.createReadStream('no.mp3').pipe(stream, { end: false })

          stream.on('done', function () {
            // The stream fires `done` when it's got nothing else to send to Discord.
          })
        })
      })
    }
  }*/


})

let botChannelID = 891308438418763776
let nigChamber = []

let triviaMode = false
let triviaQuestions = []
let currentTriviaQuestion = {}
let currentQuestionAnswer = {}
let triviaAttempts = {}
let triviaScoreboard = []

let roastHistory = []

bot.on('presence', function (user, userID, status, game, event) {
  if (user == 'bean blingus') {
    if (game != undefined) {
      bot.sendMessage({
        to: botChannelID,
        message: `Stop playing ${game.name}, son.`
      })
    }
  }
});

function getCurrentTriviaQuestion(bot, channelID) {
  if (typeof currentTriviaQuestion !== "undefined") {
    let currentQuestionDisplay = ['```']
    currentQuestionDisplay.push(' ' + String(currentTriviaQuestion.category).toUpperCase() + '\n')

    let quoteDecodedQuestion = currentTriviaQuestion.question.replace(/&quot;/g, '"')
    let apostropheDecodedQuestion = quoteDecodedQuestion.replace(/&#039;/g, "'")
    currentQuestionDisplay.push(apostropheDecodedQuestion + '\n' + '\n')

    switch (currentTriviaQuestion.type) {
      case 'multiple':
        let letters = ['A', 'B', 'C', 'D']
        util.shuffleArray(letters)
        let choices = [currentQuestionAnswer.text, ...currentQuestionIncorrect]
        currentQuestionAnswer.letter = letters[0]

        let shuffledChoices = []

        choices.forEach((choice, index) => {
          shuffledChoices.push({
            'letter': letters[index],
            'text': choice
          })
        })

        shuffledChoices.sort((a, b) => (a.letter > b.letter) ? 1 : -1)

        currentQuestionDisplay.push(shuffledChoices[0].letter + ') ' + shuffledChoices[0].text + '\n')
        currentQuestionDisplay.push(shuffledChoices[1].letter + ') ' + shuffledChoices[1].text + '\n')
        currentQuestionDisplay.push(shuffledChoices[2].letter + ') ' + shuffledChoices[2].text + '\n')
        currentQuestionDisplay.push(shuffledChoices[3].letter + ') ' + shuffledChoices[3].text + '\n')
        break

      case 'boolean':
        let tOrF = ['T', 'F']
        util.shuffleArray(tOrF)
        let choicesTF = [currentQuestionAnswer.text, ...currentQuestionIncorrect]
        currentQuestionAnswer.letter = tOrF[0]

        let shuffledChoicesTF = []

        choicesTF.forEach((choice, index) => {
          shuffledChoicesTF.push({
            'letter': tOrF[index],
            'text': choice
          })
        })

        currentQuestionDisplay.push('TRUE or FALSE')
        break
    }
    currentQuestionDisplay.push('```')
    let output = currentQuestionDisplay.join('').trim()

    bot.sendMessage({
      to: channelID,
      message: output
    })
  }
  else {
    let winner = triviaScoreboard.sort((a, b) => (a.score > b.score) ? 1 : -1)[0]
    bot.sendMessage({
      to: channelID,
      message: 'Congratulations ' + winner.name + ', you are fuckin smart. Points: ' + winner.score
    })
    triviaMode = false
  }
}

function nextTriviaQuestion() {
  currentTriviaQuestion = triviaQuestions[triviaQuestions.length - 1]
  currentQuestionIncorrect = []
  currentQuestionAnswer = {}
  triviaQuestions.pop()
  let questionDetails = []
  if (currentTriviaQuestion != undefined) {
    questionDetails.push(currentTriviaQuestion.question)
  }
  if (currentTriviaQuestion != undefined) { currentQuestionAnswer.text = currentTriviaQuestion.correct_answer }
  if (currentTriviaQuestion != undefined) { currentQuestionIncorrect = currentTriviaQuestion.incorrect_answers }
}

bot.on('message', async function (user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (user == "Mrs Kellet") {
    return
  }

  if (triviaMode) {
    if (message.substring(0, 1) == '!') {
      var args = message.substring(1).split(' ');
      var cmd = args[0];
  
      switch (cmd.toLowerCase()) {
        // !ping
        case 'stop':
          bot.sendMessage({
            to: channelID,
            message: 'Stopping Trivia...'
          });
          triviaMode = false
          break;
        
        case 'next':
          nextTriviaQuestion()
          getCurrentTriviaQuestion(bot, channelID)
          break    
      }
    }
    else {
      if (message.toLowerCase() == currentQuestionAnswer.text.toLowerCase() || message.toLowerCase() == currentQuestionAnswer.letter.toLowerCase()) {
        bot.sendMessage({
          to: channelID,
          message: user + ' got it right! Their answer: ' + message
        }, () => {
          if (triviaScoreboard.filter(e => e.name === user).length == 0) {
            triviaScoreboard.push({ 'name': user, 'score': 1 })
          }
          else {
            triviaScoreboard.find(e => e.name === user).score++
          }
          nextTriviaQuestion()
          getCurrentTriviaQuestion(bot, channelID)
        })
      }
      else {
        //triviaAttempts
      }
    }
  } else {
    if (message.toLowerCase().indexOf('nigger') != -1 || message.toLowerCase().indexOf('nig') != -1) {
      let serverID = bot.channels[channelID].guild_id
      server = bot.servers[serverID]
  
      bot.kick({
        serverID,
        userID
      }, (error) => {
        logger.info(error)
      })
  
      nigChamber.push(userID)
    }

    if (message.toLowerCase().indexOf('thank you') != -1 || message.toLowerCase().indexOf('thanks') != -1) {
      bot.sendMessage({
        to: channelID,
        message: "No problem cunt.",
        tts: true
      })
    }
  
  
  
    if (message.substring(0, 1) == '!') {
      var args = message.substring(1).split(' ');
      var cmd = args[0];
  
      switch (cmd.toLowerCase()) {
        // !ping
        case 'ping':
          bot.sendMessage({
            to: channelID,
            message: 'Pong!'
          });
          break;
  
        case 'lows':
          bot.sendMessage({
            to: channelID,
            message: 'CHEESE CHEESE CHEESE'
          })
          break;
  
        case 'coin':
          bot.sendMessage({
            to: channelID,
            message: `You flipped a coin, it was ${command.coinFlip()}`
          })
          break;
  
        case 'define':
          try {
            if (args[1] == undefined) {
              util.botPrintError(bot, channelID)
              break
            }
            let word = args[1]
            command.define(word, bot, channelID)
  
            break
          } catch {
            util.botPrintError(bot, channelID)
            break
          }
  
        case 'dice':
          try {
            if (args[1] == undefined) {
              util.botPrintError(bot, channelID)
              break
            }
            let sides = args[1]
            bot.sendMessage({
              to: channelID,
              message: `You rolled a ${sides} sided die, it was ${command.diceRoll(sides)}`
            })
            break
          } catch {
            util.botPrintError(bot, channelID)
            break
          }
  
        case 'roast':
          try {
            if (args[1] == undefined) {
              util.botPrintError(bot, channelID, 'Yo cmon, who the fuck am I gonna roast?')
              break
            }
            let roastArgs = args.slice(1)
            let tts = false
            if (roastArgs[roastArgs.length - 1].toLowerCase() == 'tts') {
              tts = true
              roastArgs.pop()
            }

            let name = roastArgs.join(' ').trim()

            bot.sendMessage({
              to: channelID,
              message: command.roast(name),
              tts
            })

            break
          } catch (e) {
            util.botPrintError(bot, channelID, e)
            break
          }

        case 'trivia':
          try {
            triviaMode = true
            let amount = args[1] ?? 10
            let difficulty = args[2] ?? 'medium'
            let response = await command.trivia(amount, difficulty, bot, channelID)
            triviaQuestions = response.results

            nextTriviaQuestion()
            getCurrentTriviaQuestion(bot, channelID)
            break
          } catch (e) {
            util.botPrintError(bot, channelID, e)
            break
          }

        case 'greg':
          xml.scrapeGregsKitchen(bot, channelID)
          break
        // Just add any case commands if you want to..
      }
    }
  
    // CHATBOT MESSAGES
    /*bot.sendMessage({
        to: channelID,
        message: output(message)
    })*/
  }
});

function compare(triggerArray, replyArray, text) {
  let item;
  for (let x = 0; x < triggerArray.length; x++) {
    for (let y = 0; y < replyArray.length; y++) {
      if (triggerArray[x][y] == text) {
        items = replyArray[x];
        item = items[Math.floor(Math.random() * items.length)];
      }
    }
  }
  return item;
}

function output(input) {
  let product;
  let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");
  text = text
    .replace(/ a /g, " ")
    .replace(/i feel /g, "")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
    .replace(/ please/g, "");

  //compare arrays
  //then search keyword
  //then random alternative

  if (compare(trigger, reply, text)) {
    product = compare(trigger, reply, text);
  } else if (text.match(/robot/gi)) {
    product = robot[Math.floor(Math.random() * robot.length)];
  } else {
    product = alternative[Math.floor(Math.random() * alternative.length) + 1];
  }

  return product;
}

const trigger = [
  //0 
  ["hi", "hey", "hello", "yo", "dee's mum", "d's mum", "Mrs Kellet"],
  //1
  ["how are you", "how are things"],
  //2
  ["what is going on", "what is up"],
  //3X
  ["happy", "good", "well", "fantastic", "cool"],
  //4
  ["bad", "bored", "tired", "sad"],
  //5
  ["what do you think of dee"],
  //6
  ["thanks", "thank you"],
  //7
  ["bye", "good bye", "goodbye"],
  //8

];

const reply = [
  //0 
  ["Hello!", "Hi!", "Hey!", "Hi there!"],
  //1
  [
    "Fine... how are you?",
    "Pretty well, how are you?",
    "Fantastic, how are you?"
  ],
  //2
  [
    "Nothing much",
    "Exciting things!"
  ],
  //3
  ["Glad to hear it"],
  //4
  ["Why?", "Cheer up buddy"],
  //5
  ["I love when my son points guns at me!"],
  //6
  ["You're welcome", "No problem"],
  //7
  ["Goodbye", "See you later"],
  //8

];

const alternative = [
  "Same",
  "Go on...",
  "Try again",
  "I'm listening...",
  "Bro..."
];