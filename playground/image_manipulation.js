const Jimp = require('jimp');

Jimp.read('./DWLandTiles_nogap.png')
    .then(tiles => {
        const newImage = tiles.clone();
        newImage.resize(256,240);

        for(let i = 0; i < 15; i++) {
            for(let j = 0; j < 16; j++) {
                let sprite = tiles.clone();
                sprite.crop(0,0,16,16);
                newImage.composite(sprite, (j * 16), (i * 16));
            }
        }

        return newImage.write('test-output.jpg');
    });