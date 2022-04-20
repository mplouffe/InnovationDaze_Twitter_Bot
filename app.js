require('./config/config');

const Bot = require('./bots/bots');
const express = require('express');
const Twitter = require('twitter');
const fs = require('fs');

const RandomTechBot = require('./bots/rndTechBot/randomTechBot');
const RndEncounterBot = require('./bots/rndEncounter/rndEnounterBot');
const OutArtBot = require('./bots/outArtBot/outArtBot');

const app = express();
const PORT = process.env.PORT;

var waitInterval;
var currentBot;
var currentTweetType;

function ScheduleTweet() {
    // STEP 1: Fetch schedule json
    let schedule = getSchedule();

    // STEP 2: Fetch current date and time
    let currentDate = new Date();

    // STEP 3: Find the next scheduled tweet
    let nextTweetFound = false;
    let nextTweet = null;
    let currentDayOfWeek = currentDate.toLocaleDateString('en-us', { weekday: 'short'});

    let nextTweetDate = new Date();
    while (!nextTweetFound)
    {
        // STEP 3a: Fetch schedule for current day
        let currentSchedule = schedule.days[currentDayOfWeek];

        // STEP 3b: Cycle through current schedule looking for next tweet
        for (let i = 0; i < currentSchedule.length && !nextTweetFound; i++)
        {
            nextTweetDate.setHours(currentSchedule[i].hour, currentSchedule[i].minute, 0);
            if (currentDate < nextTweetDate)
            {
                nextTweetFound = true;
                nextTweet = currentSchedule[i];
            }
        }

        // STEP 3c: If no tweet found, increment day before next loop
        if (!nextTweetFound)
        {
            nextTweetDate.setHours(0, 0, 0);
            nextTweetDate.setDate(nextTweetDate.getDate() + 1);
            currentDayOfWeek = nextTweetDate.toLocaleDateString('en-us', { weekday: 'short'});
        }
    }

    // STEP 4: Save info about the tweet to be generated
    currentBot = Bot.StringToEnum(nextTweet.bot);
    currentTweetType = nextTweet.tweetType;

    // STEP 5: Update the nextTweetDate with the new scheduled tweet info
    nextTweetDate.setHours(nextTweet.hour);
    nextTweetDate.setMinutes(nextTweet.minute + 1);

    // SETP 6: Calculate the duration to wait before tweeting
    waitInterval = nextTweetDate - currentDate;

    waitInterval = 5000;

    setTimeout(BotRun, waitInterval);
}

function BotRun() {
    // STEP 1: Load the Bot
    let bot = LoadBot(currentBot);

    // STEP 2: Generate the tweet
    let tweet = bot.generateTweet(currentTweetType, resolvedCallback)

    // STEP 3: Set up credentials
    let client = GenerateTwitterClient(currentBot);

    // STEP 4: Send Tweet
    if (currentTweetType === "text") {
        client.post('statuses/update', { status: tweet}, function(error, tweet, response) {
            if (error) {
              console.log(`Error generating image tweet: ${error}`)
            } else {
              console.log("Successful tweet!")
            }
        });
    }
    else if (currentTweetType === "image") {

    }


    // STEP 5: Scheule next tweet
    ScheduleTweet();
}

function resolvedCallback(tweet) {
    client.post("media/upload", { media: tweet.image }, function(error, media, response) {
        if (error) {
          console.log(`Error uploading media to Twitter: ${error}`);
        }
        else {
          let status = {
            status: tweet.title,
            media_ids: media.media_id_string
          };
       
          client.post("statuses/update", status, function(error, tweet, response) {
            if (error) {
              console.log(`Error generating image tweet: ${error}`)
            } else {
              console.log("Successfully tweeted an image!")
            }
          });
        }
      });
}

function LoadBot(currentBot) {
    let bot;
    switch (currentBot) {
        case Bot.RandomTechBot:
            bot = new RandomTechBot();
            break;
        case Bot.RndEncounter:
            bot = new RndEncounterBot();
            break;
        case Bot.OutArtBot:
            bot = new OutArtBot();
            break;
    }
    return bot;
}

function GenerateTwitterClient(currentBot) {
    let client;
    client = {};
    client.post = function(type, tweet, callback) {
        if (type === "media/upload") {
            console.log("uploading media...");
            console.log(tweet.media);
            let media = {
                media_id_string: "media_id_string"
            };
            callback(null, media, null);
        }
        else if (type === "statuses/update") {
            console.log("client post called...");
            console.log("tweet content: ");
            console.log(tweet.status);
            callback(null, tweet, null);
        }
    };
    return client;

    switch (currentBot) {
        case Bot.RndEncounter:
            client = new Twitter({
                consumer_key: process.env.RND_ENCOUNTER_TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.RND_ENCOUNTER_TWITTER_CONSUMER_SECRET,
                access_token_key: process.env.RND_ENCOUNTER_TWITTER_ACCESS_TOKEN_KEY,
                access_token_secret: process.env.RND_ENCOUNTER_TWITTER_ACCESS_TOKEN_SECRET
            });
            break;
        case Bot.RandomTechBot:
            client = new Twitter({
                consumer_key: process.env.RND_TECH_TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.RND_TECH_TWITTER_CONSUMER_SECRET,
                access_token_key: process.env.RND_TECH_TWITTER_ACCESS_TOKEN_KEY,
                access_token_secret: process.env.RND_TECH_TWITTER_ACCESS_TOKEN_SECRET
            });
            break;
        case Bot.OutArtBot:
            client = new Twitter({
                consumer_key: process.env.OUT_ART_TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.OUT_ART_TWITTER_CONSUMER_SECRET,
                access_token_key: process.env.OUT_ART_TWITTER_ACCESS_TOKEN_KEY,
                access_token_secret: process.env.OUT_ART_TWITTER_ACCESS_TOKEN_SECRET
            });
    }
    return client;
}

function getSchedule() {
    try {
        let rawSchedule = fs.readFileSync('./schedule/schedule.json', 'utf-8');
        return JSON.parse(rawSchedule);
    }
    catch(err) {
        console.log('Error reading schedule.json: ' + err);
    }
}

app.get('/', (req, res) => res.send('Bot is running...'));

app.listen(PORT, () => console.log(`Twitter Bot Scheduler is up and running on ${PORT}`));

ScheduleTweet();
