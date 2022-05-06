const Jimp = require('jimp');

var imageBase;
var imageArray = [];
var numImagesToLoad;
var imageGeneratorToRun;
var imageGeneratedCallback;

const generateCollageImage = (callback) => {
    imageGeneratedCallback = callback;
    imageArray = [];
    numImagesToLoad = 2;
    new Jimp(500, 500, (err, image) => {
        imageBase = image;
    });
    imageGeneratorToRun = parallelLines;
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

const parallelLines = () => {
    let interval = 500 / 20;
    for (let i = 0; i < 10; i++) {
        let topImage, bottomImage;
        if (i % 2 == 0) {
            topImage = imageArray[0].clone();
            bottomImage = imageArray[1].clone();
        }
        else {
            topImage = imageArray[1].clone();
            bottomImage = imageArray[0].clone();
        }

        let xPos = i * interval;
        let topYPos = 0;
        let bottomYPos = 500 - (i * interval);

        topImage.crop(xPos, topYPos, interval, bottomYPos);
        imageBase.composite(topImage, xPos, topYPos);

        bottomImage.crop(xPos, bottomYPos, interval, 500 - bottomYPos);
        imageBase.composite(bottomImage, xPos, bottomYPos);
    }

    for (let i = 10; i < 20; i++) {
        let topImage, bottomImage;
        if (i % 2 == 0) {
            topImage = imageArray[1].clone();
            bottomImage = imageArray[0].clone();
        }
        else {
            topImage = imageArray[0].clone();
            bottomImage = imageArray[1].clone();
        }

        let xPos = i * interval;
        let topYPos = 0;
        let bottomYPos = 500 - (i * interval) - interval;

        topImage.crop(xPos, topYPos, interval, 500 - bottomYPos);
        imageBase.composite(topImage, xPos, topYPos);

        bottomImage.crop(xPos, 500 - bottomYPos, interval, bottomYPos);
        imageBase.composite(bottomImage, xPos, 500 - bottomYPos);
    }
}

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  }

module.exports = { generateCollageImage }