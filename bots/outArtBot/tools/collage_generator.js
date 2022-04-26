const google_images = require("free-google-images");
const Jimp = require('jimp');

var imageBase;
var imageArray = [];

const fetchImage = () => {
    new Jimp(256, 256, (err, image) => {
        imageBase = image;
    });

    google_images.searchRandom("blah", true)
        .then((result) => {
            return Jimp.read(result.image.url);
        })
        .then((image) => {
            imageArray.push(image);
            return google_images.searchRandom("blarg", true);
        })
        .then((result) => {
            return Jimp.read(result.image.url);
        })
        .then((image) => {
            imageArray.push(image);
            return google_images.searchRandom("bleep", true);
        })
        .then((result) => {
            return Jimp.read(result.image.url);
        })
        .then((image) => {
            imageArray.push(image);

            imageArray.forEach((image) => {
                let x = getRandomInt(image.bitmap.width/2);
                let y = getRandomInt(image.bitmap.height/2);
                let height = getRandomInt(image.bitmap.height - y - 40) + 40;
                let width = getRandomInt(image.bitmap.width - x - 40) + 40;

                image.crop(x, y, width, height);
                
                let compositeX = getRandomInt(imageBase.bitmap.width - image.bitmap.width);
                let compositeY = getRandomInt(imageBase.bitmap.height - image.bitmap.height);
                imageBase.composite(image, compositeX, compositeY, {
                    mode: Jimp.BLEND_MULTIPLY
                });
            });
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