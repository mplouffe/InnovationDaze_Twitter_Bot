const express = require('express');
const scheduler = require('./infrastructure/scheduler');

const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => res.send('Bot is running...'));

app.listen(PORT, () => console.log(`Rnd Encounter up and running on ${PORT}`));

scheduleTweet();

function scheduleTweet() {
    let [tweetGenerator, tweetType, waitDuration] = scheduler.getNextScheduledTweet();
    setTimeout((tweetGenerator, tweetType) => {
        console.log("Timed out function called");
        tweetGenerator.sendTweet(tweetType);
    }, waitDuration);
}