const fs = require('fs');

class RandomTechBot {
    GenerateTweet(tweetType) {
        let tweet;
        switch (tweetType) {
            case "text":
                tweet = this.GenerateTextTweet();
                break;
        }
        return tweet;
    }

    GenerateTextTweet() {
        // let tweetFormat = Math.floor(Math.random() * 9) + 1;
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