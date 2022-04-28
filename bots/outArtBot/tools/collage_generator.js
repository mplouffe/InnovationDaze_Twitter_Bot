const Jimp = require('jimp');

var imageBase;
var imageArray = [];
var numImagesToLoad;
var imageGeneratorToRun;
var imageGeneratedCallback;

const generateCollageImage = (callback) => {
    imageGeneratedCallback = callback;
    imageArray = [];
    numImagesToLoad = 3;
    new Jimp(500, 500, (err, image) => {
        imageBase = image;
    });
    imageGeneratorToRun = randomSquares;
    loadImageArray();
}

const loadImageArray = () => {
    if (numImagesToLoad > 0) {
        numImagesToLoad--;
        Jimp.read('https://picsum.photos/500/500')
            .then((image) => {
                imageArray.push(image);
                loadImageArray();
            });
    }
    else
    {
        imageGeneratorToRun();
        imageBase.writeAsync('./artifacts/outArtBot/collage.png')
            .then((result, err) => {
                console.log(err);
            });
    }
}

const randomSquares = () => {
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
}

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  }

module.exports = { generateCollageImage }