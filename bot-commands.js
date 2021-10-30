const googleDictionary = require('google-dictionary-api');
const { get } = require('osmosis');
const Trivia = require('trivia-api')
const triviaApi = new Trivia({ encoding: 'url3986' });

let roastHistory = []

async function trivia(amount, difficulty, bot, channelID) {
    let options = {
        amount,
        difficulty
    }

    bot.sendMessage({
        to: channelID,
        message: 'Entering Trivia Mode...'
    })

    return triviaApi.getQuestions(options)
}

function define(word, bot, channelID) {
    let content = []
    content.push(`> Definitions for ${word}: \n`)
    content.push('```')

    googleDictionary.search(word, 'en')
        .then(results => {
            let meaning = results[0].meaning
            for (var key in meaning) {
                content.push(' ' + key.toUpperCase() + '\n')

                meaning[key].forEach((element, index) => {
                    content.push(`${index + 1}. ${element.definition}` + '\n')
                })

                content.push('\n')
            }
            content.push('```')
            let contentString = content.join('').trim()
            bot.sendMessage({
                to: channelID,
                message: contentString
            })
        })
        .catch(error => {
            console.log(error)
            bot.sendMessage({
                to: channelID,
                message: error
            })
        })
}

function roast(name) {
    var verbs = ['sing', 'suck dick', 'run', 'dance', 'eat', 'look', 'play Apex', 'play Siege', 'eat ass', 'finger-blast'];
    var puttingWords = ['put', 'shove', 'force', 'ram', 'forcefully shove', 'cram', 'deposit', 'thrust', 'shoot', 'stick']
    var puttingAdverbs = ['puts', 'shoves', 'forces', 'rams', 'forcefully shoves', 'crams', 'deposits', 'thrusts', 'shoots', 'sticks']
    var adverbs = ['inhales', 'sucks', 'munches', 'gobbles', 'snorts', 'eats', 'fucks', 'finger-blasts', 'chews', 'ejaculates on', 'rubs']
    var adverbsIng = ['inhaling', 'munching', 'sucking', 'smelling', 'eating', 'gobbling', 'touching', 'fingering', 'jacking off with', 'looking at']
    var objects = ['bongs', 'cock', 'willies', 'meth', 'crunched up jizz', 'petrol', 'dingleberries', 'crabs', 'Mac and Cheese', 'smegma', 'KFC zinger boxes', 'diarrhea', 'cheeseburgers']
    var adjectives = ['big', 'small', 'stupid', 'Jewish', 'disappointing', 'fat','maggot', 'retarded', 'black', 'Mexican', 'disabled', 'fucked up', 'fucked', 'sweaty', 'stinky', 'cheesy', 'brown', 'chunky', 'inbred', 'disgusting', 'rank', 'putrid', 'dysfunctional'];
    var adjectivesWithEr = ['stupider', 'fatter', 'blacker', 'whiter', 'more retarded', 'niggier', 'worse', 'stinkier', 'cheesier', 'browner', 'more disgusting', 'more inbred']
    var bodyParts = ['nose', 'head', 'dick', 'ass', 'willy', 'mum', 'gooch', 'crack', 'foreskin', 'cock', 'itchy bum', 'anus', 'cheeks', 'urethra', 'cum guts', 'cum tum', 'cunt', 'pussy'];
    var swearPhrases = ['Fuck me', 'Holy cunt', 'Holy shit', 'Holy fuck', 'Fuck me dead', 'Damn', 'Oh my god']
    var nouns = ['tired cunt', 'autist', 'dickhead', 'elephant', 'fuckhead', 'retard', 'gook', 'cripple', 'fag', 'nig', 'curry muncher', 'nigger', 'crackhead', 'ice mite', 'n word', 'wack sucka', 'Jew', 'cunt', 'kid', 'twelve year old'];
    var characters = ['a Moira player', 'the Holocaust', 'Lucas Franco', 'George Floyd', 'a down syndrome kid', 'the Dirty Bird', 'David Guetta', "Dee's Mum", 'Michael Jackson', "Domino's Pizza", '9-11']
    var insults = ['Fuck off', 'Get fucked', 'Eat shit', 'Suck my dick', 'Eat a dick']
    var animals = ['panda', 'walrus', 'slug', 'hippo', 'giraffe', 'rabbit', 'donkey', 'worm', 'maggot']

    nouns = nouns.concat(animals)

    //randomly select an item from each list
    /*var verb = g(verbs);
    var adj = g(adjectives);
    var noun = g([...nouns, ...animals]);
    var bod = g(bodyParts);
    var swear = g(swearPhrases)
    var char = g(characters)
    var adjEr = g(adjectivesWithEr)
    var adv = g(adverbs)
    var obj = g(objects)
    var ins = g(insults)
    var advIng = g(adverbsIng)
    var put = g(puttingWords)
    var putAdv = g(puttingAdverbs)*/

    // Similar sentence structures are grouped into their own lists to reduce occurrence of similar structures.
    var sentenceStructure = [
        name + ', you ' + g(verbs) + ' like a ' + g(adjectives) + ' ' + g(nouns) + '.',
        'I think ' + name + ' is very fuckin ' + g(adjectives) + '.',
        [
            'Did you guys see ' + name + "'s " + g(bodyParts) + '? ' + g(swearPhrases) + ', that shit is ' + g(adjectives) + '.',
            'Did you guys see ' + name + "'s " + g(bodyParts) + '? ' + g(swearPhrases) + ', that shit is ' + g(adjectivesWithEr) + ' than ' + g(characters) + '.'
        ],
        //'If ' + char + ' was ' + adj + ', it would be ' + name + '.',
        name + ' looks like a ' + g(adjectivesWithEr) + ' version of ' + g(characters) + '.',
        name + ' ' + g(adverbs) + ' more ' + g(objects) + ' than ' + g(characters) + '.',
        name + ' definitely ' + g(adverbs) + ' ' + g(objects) + ' out of ' + g(characters) + "'s " + g(bodyParts) + '.',
        g(insults) + " " + name + ', you ' + g(adjectives) + " " + g(nouns) + '.',
        name + ', you probably like ' + g(objects) + ' in your ' + g(bodyParts) + ' you ' + g(nouns) + '.',
        name + ' likes ' + g(adverbsIng) + ' ' + g(objects) + ' like a ' + g(adjectives) + ' ' + g(nouns) + '.',
        [
            name + ", you're actually a " + g(adjectives) + ' ' + g(nouns) + '.',
            name + ", you're actually " + g(characters) + '.',
            name + ", you're actually a " + g(nouns) + '.'
        ],
        g(swearPhrases) + ' ' + name + ', you are ' + g(adjectives) + '.',
        [
            name + ', you make me wanna ' + g(puttingWords) + ' ' + g(objects) + ' into my ' + g(bodyParts) + '.',
            name + ', you make me wanna ' + g(puttingWords) + ' ' + g(objects) + ' into my ' + g(adjectives) + ' ' + g(bodyParts) + '.'
        ],
        name + ' probably ' + g(puttingAdverbs) + ' ' + g(objects) + ' in their ' + g(bodyParts) +  '.',
        name + ', you are more ' + g(adjectives) + ' than a ' + g(adjectives) + ' ' + g(nouns) + '.',
        [
            name + ' gives ' + g(objects) + ' to ' + g(adjectives) + ' ' + g(nouns) + 's.',
            name + ' gives ' + g(objects) + ' to ' + g(nouns) + 's.'
        ]
        
    ]

    //construct the sentence that we'll output
    var sentence = g(sentenceStructure)

    if (roastHistory.find(roast => {
        return roast.structure === sentence
    }) == undefined) {
        roastHistory.push({
            structure: sentence,
            count: 1
        })
    }
    else {
        let mostUsedRoast = roastHistory.reduce((a, b) => a.count > b.count ? a : b);

        if (sentenceStructure === mostUsedRoast.structure) {
            const index = sentenceStructure.indexOf(sentence);
            if (index > -1) {
                let structuresMinusMostUsed = [...sentenceStructure]
                copy.splice(index, 1);
            }
            var sentence = g(structuresMinusMostUsed)
        }
        else {
            roastHistory.find(roast => {
                return roast.structure === sentenceStructure
            }).count++
        }
    }
    
    //output the sentence to the web page
    return sentence
}

// return a random item from a list
function g(list) {
    for (let i = list.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    // If list[0] isnt a string it must be a list so we randomise that inner list and pick one
    if (typeof list[0] != 'string') {
        for (let i = list[0].length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [list[0][i], list[0][j]] = [list[0][j], list[0][i]];
        }
        return list[0][0];
    }
    return list[0];
}

function coinFlip() {
    let random = Math.floor(Math.random() * 2) + 1;
    return random == 1 ? 'Heads' : 'Tails'
}

function diceRoll(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

module.exports = { coinFlip, diceRoll, define, roast, trivia };