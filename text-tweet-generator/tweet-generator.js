const fs = require('fs');

const generateTextTweet = () => {
    // let tweetFormat = Math.floor(Math.random() * 9) + 1;
    let tweetFormat = 1;
    let tweetPath = `./old-text/tweet_0${tweetFormat}.json`;
    return new Promise(function(resolve, reject) {
        fs.readFile(tweetPath, 'utf8', (err, data) => {
            if(err) {
                reject(err);
                return;
            }

            let jsonData = JSON.parse(data);
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

            resolve(tweetText);
        });
    });
};

module.exports = { generateTextTweet };