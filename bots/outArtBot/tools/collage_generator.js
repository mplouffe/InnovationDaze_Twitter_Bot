const Jimp = require('jimp');

var imageBase;
var imageArray = [];

const fetchImage = () => {
    new Jimp(500, 500, (err, image) => {
        imageBase = image;
    });
    
    Jimp.read('https://picsum.photos/500/500')
        .then((image) => {
            imageArray.push(image);
            return Jimp.read('https://picsum.photos/500/500');
        })
        .then((image) => {
            imageArray.push(image);
            return Jimp.read('https://picsum.photos/500/500');
        })
        .then((image) => {
            imageArray.push(image);

            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    let xPos = j * 100;
                    let yPos = i * 100;

                    let image = getRandomInt(3);
                    let currentImage = imageArray[image].clone();
                    
                    currentImage.crop(xPos, yPos, 100, 100);

                    imageBase.composite(currentImage, xPos, yPos);
                }
            }
            console.log("about to output image...");
            return imageBase.writeAsync('./artifacts/outArtBot/collage.png');
        })
        .then((result) => {
            console.log("collage generated!");
        });
}

const generateCollageImage = () => {
    fetchImage();
}

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  }

module.exports = { generateCollageImage }