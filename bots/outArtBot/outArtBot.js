const fs = require('fs');

const { generateHtmlImage } = require('./tools/html_image_generation');
const { generateCollageImage } = require('./tools/collage_generator');

class OutArtBot {
    generateTweet(tweetType) {
        let tweet;
        switch (tweetType) {
            case "image":
                let image = this.generateImage();
                let title = this.generateTitle();
                tweet = { image, title };
                break;
            case "collage":
                generateCollageImage();
                break;
        }
        return tweet;
    }

    generateImage() {
        try {
            let imageData = generateHtmlImage();
            return imageData;
        }
        catch (err) {
            console.log(`Error generating image in OutArtBot: ${err}`);
        }
    }

    generateTitle() {
        let titleFormat = 1;
        let titlePath = `./bots/outArtBot/json/outArtTitle_0${titleFormat}.json`;
        try {
            let rawData = fs.readFileSync(titlePath, 'utf-8');
    
            let jsonData = JSON.parse(rawData);
            let elements = jsonData.tweet.elements;
    
            let imageTitle = "";
            elements.forEach(element => {
                if(element.length === 1) {
                    imageTitle += element[0];
                } else {
                    let pickedIndex = Math.floor(Math.random() * element.length);
                    imageTitle += element[pickedIndex];
                }
            });
            return imageTitle;
        }
        catch (err) {
            console.log(`Error generating image title in OutArtBot: ${err}.`);
        }
    }
}

module.exports = OutArtBot;
