const express = require('express');
const Scheduler = require('./infrastructure/scheduler');
const RandomTechBot = require('./tweet-generators/randomTechBot');

const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => res.send('Bot is running...'));

app.listen(PORT, () => console.log(`Twitter Bot Controller is up and running on ${PORT}`));

let bots = initializeBots();
scheduleTweet(bots);

function scheduleTweet(bots) {
    let [tweetGenerator, tweetType, waitDuration] = Scheduler.nextScheduledTweet(bots);
    console.log("setting timeout...");
    console.log("wait duration: " + waitDuration);
    setTimeout(() => {
        console.log("Timed out function called");
        let tweet = tweetGenerator.sendTweet(tweetType);
        console.log(tweet);
    }, waitDuration);
}

function initializeBots() {
    let bot =  new RandomTechBot();
    let bots = [ bot ];
    return bots;
}