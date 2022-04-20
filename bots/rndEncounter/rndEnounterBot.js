const fs = require('fs');

class RndEncounterBot {
    generateTweet(tweetType) {
        let tweet;
        switch (tweetType) {
            case "text":
                tweet = this.generateTextTweet();
                break;
        }
        return tweet;
    }

    generateTextTweet() {
        let tweetFormat = Math.floor(Math.random() * 9) + 1;
        let tweetPath = `./bots/rndEncounter/json/rndEncounter_0${tweetFormat}.json`;

        try {
            let rawTweetData = fs.readFileSync(tweetPath, 'utf-8');
            let jsonData = JSON.parse(rawTweetData);
            let elements = jsonData.tweet.elements;
            let tweetText = "";
            elements.forEach(element => {
                if(element.length === 1) {
                    tweetText += element[0];
                } else {
                    let pickedIndex = Math.floor(Math.random() * element.length);
                    tweetText += element[pickedIndex];
                }
            });
            return tweetText;
        } 
        catch (err) {
            console.log("Error generating text tweet in RndEncounter: " + err);
        }
    }
};

module.exports = RndEncounterBot;