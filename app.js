require('./config/config');
const express = require('express');
const Twitter = require('twitter');
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
let schedule = getSchedule();

// STEP 2: Fetch current date and time
let date = new Date();
let dayOfWeek = date.toLocaleDateString('en-us', { weekday: 'short'});
let hour = date.getHours();
let minute = date.getMinutes();

console.log("dayOfWeek: " + dayOfWeek);
console.log("hour: " + hour);
console.log("minute: " + minute);

// STEP 3: Find the next scheduled tweet
let nextTweetFound = false;
let nextTweet = null;
let currentDayOfWeek = date.toLocaleDateString('en-us', { weekday: 'short'});

while (!nextTweetFound)
{
    // STEP 3a: Fetch schedule for current day
    let currentSchedule = schedule.days[currentDayOfWeek];
    
    // STEP 3b: Cycle through current schedule looking for next tweet
    for (let i = 0; i < currentSchedule.length; i++)
    {
        if (currentSchedule[i].hour >= hour)
        {
            if (currentSchedule[i].minute > minute)
            {
                nextTweetFound = true;
                nextTweet = currentSchedule[i];
            }
        }
    }

    // STEP 3c: If no tweet found, increment day before next loop
    if (!nextTweetFound)
    {
        date.setDate(date.getDate() + 1);
        currentDayOfWeek = date.toLocaleDateString('en-us', { weekday: 'short'});
    }
}

console.log("Tweet Found!");
console.log(nextTweet);


let initialInterval = 5000;

setInterval(() => {
    console.log('sanity check');
}, initialInterval);



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