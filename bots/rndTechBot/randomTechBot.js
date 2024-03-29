const fs = require('fs');

class RandomTechBot {
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
        let tweetFormat = 1;
        let tweetPath = `./bots/rndTechBot/json/techBot_0${tweetFormat}.json`;
        try {
            let rawData = fs.readFileSync(tweetPath, 'utf8');
    
            let jsonData = JSON.parse(rawData);
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
            console.log("Error generating text tweet in RandomTechBot: " + err);
        }
    }
};

module.exports = RandomTechBot;