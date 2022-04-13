require('./config/config');
const express = require('express');
const Twitter = require('twitter');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT;

var waitInterval;
var currentBot;
var currentTweetType;

function ScheduleTweet() {
    // STEP 1: Fetch schedule json
    let schedule = getSchedule();

    // STEP 2: Fetch current date and time
    let nextTweetDate = new Date();
    let currentHour = nextTweetDate.getHours();
    let currentMinute = nextTweetDate.getMinutes();

    // console.log("dayOfWeek: " + dayOfWeek);
    // console.log("hour: " + currentHour);
    // console.log("minute: " + currentMinute);

    // STEP 3: Find the next scheduled tweet
    let nextTweetFound = false;
    let nextTweet = null;
    let currentDayOfWeek = nextTweetDate.toLocaleDateString('en-us', { weekday: 'short'});

    while (!nextTweetFound)
    {
        // STEP 3a: Fetch schedule for current day
        let currentSchedule = schedule.days[currentDayOfWeek];

        // STEP 3b: Cycle through current schedule looking for next tweet
        for (let i = 0; i < currentSchedule.length; i++)
        {
            if (currentSchedule[i].hour >= currentHour)
            {
                if (currentSchedule[i].minute > currentMinute)
                {
                    nextTweetFound = true;
                    nextTweet = currentSchedule[i];
                }
            }
        }

        // STEP 3c: If no tweet found, increment day before next loop
        if (!nextTweetFound)
        {
            nextTweetDate.setDate(nextTweetDate.getDate() + 1);
            currentDayOfWeek = nextTweetDate.toLocaleDateString('en-us', { weekday: 'short'});
        }
    }

    // STEP 4: Save info about the tweet to be generated
    currentBot = nextTweet.bot;
    currentTweetType = nextTweet.tweetType;

    // STEP 5: Update the nextTweetDate with the new scheduled tweet info
    nextTweetDate.setHours(nextTweet.hour);
    nextTweetDate.setMinutes(nextTweet.minute + 1);

    // SETP 6: Calculate the duration to wait before tweeting
    let currentDate = new Date();
    waitInterval = nextTweetDate - currentDate;

    setTimeout(BotRun, waitInterval);
}


function BotRun() {
        // STEP 1: Load the Bot
        let bot = LoadBot(currentBot);

        // STEP 2: Generate the tweet
        let tweet = bot.GenerateTweet(currentTweetType)

        // STEP 3: Set up credentials
        let client = GenerateTwitterClient(currentBot);

        // STEP 4: Send Tweet
        client.post('statuses/update', { status: tweet});

        // STEP 5: Scheule next tweet
        ScheduleTweet();
}

function GenerateTwitterClient(currentBot) {
    let client;
    switch (currentBot) {
        case "rndEncounter":
            client = new Twitter({
                consumer_key: process.env.RND_ENCOUNTER_TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.RND_ENCOUNTER_TWITTER_CONSUMER_SECRET,
                access_token_key: process.env.RND_ENCOUNTER_TWITTER_ACCESS_TOKEN_KEY,
                access_token_secret: process.env.RND_ENCOUNTER_TWITTER_ACCESS_TOKEN_SECRET
            });
            break;
    }
    return client;
}

app.get('/', (req, res) => res.send('Bot is running...'));

app.listen(PORT, () => console.log(`Twitter Bot Scheduler is up and running on ${PORT}`));

function getSchedule() {
    try {
        let rawSchedule = fs.readFileSync('./schedule/schedule.json', 'utf-8');
        return JSON.parse(rawSchedule);
    }
    catch(err) {
        console.log('Error reading schedule.json: ' + err);
    }
}