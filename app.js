require('./config/config');
const express = require('express');
const Twitter = require('twitter');
const { generateTextTweet } = require('./text-tweet-generator/tweet-generator');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT;

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// STEP 1: Fetch schedule json
setInterval(() => {
    let schedule = getSchedule();
    console.log(schedule);
}, 5000);



// setInterval(() => {
//     generateTextTweet()
//         .then((status) => {
//             console.log(status);
//             return client.post('statuses/update', { status: status });
//         })
//         .then((tweet) => {
//             console.log('Successful tweet!')
//         })
//         .catch((err) => {
//             console.log('ERR!: ', err);
//         });
// }, 28800000);

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