const nodeHtmlToImage = require('node-html-to-image');
const compile = require('hyperjs').compile;

var canvasWidth, canvasHeight;

const generateCanvas = (backgroundColor) => {
    canvasWidth = getRandomArbitrary(100, 400);
    canvasHeight = getRandomArbitrary(100, 400);

    return 'background-color:' + backgroundColor + '; width:' + canvasWidth + 'px; height:' + canvasHeight + 'px;';
}

const generateElementStyle = (color) => {
    let returnString;

    // determine random width and height
    let width = getRandomArbitrary(10, canvasWidth / 3);
    let height = getRandomArbitrary(10, canvasHeight / 3);

    // determine random position
    let top = getRandomArbitrary(0, canvasHeight - height);
    let left = getRandomArbitrary(0, canvasWidth - width);

    returnString = 'position:absolute; top:' + top + 'px; left:' + left + 'px; ';
    returnString += 'background-color:' + color + '; width:' + width + 'px; height: ' + height + 'px;';
    
    return returnString;
}

const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const getRandomColor = () => {
    return 'rgb(' + getRandomArbitrary(0, 255) + ',' + getRandomArbitrary(0, 255) + ',' + getRandomArbitrary(0, 255) + ');';
}

const generateElement = (color) => {
    return {
        tag: 'div',
        properties: {
            style: generateElementStyle(color)
        }
    }
}

const shuffleArray = (array) => {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

const generateElements = (primaryColor, primaryElementsCount, secondaryColor, secondaryElementsCount) => {
    let elementsArray = [];
    for (let i = 0; i < primaryElementsCount; i++) {
        elementsArray.push(generateElement(primaryColor));
    }
    for (let i = 0; i< secondaryElementsCount; i++) {
        elementsArray.push(generateElement(secondaryColor));
    }

    return shuffleArray(elementsArray);
}

const generateHtmlImage = (tweetCallback) => {

    let backgroundColor = getRandomColor();
    let primaryColor = getRandomColor();
    let secondaryColor = getRandomColor();

    let primaryElementsCount = getRandomArbitrary(3, 8);
    let secondaryElementsCount = getRandomArbitrary(3, 8);

    var complexTag = {
        tag: 'body',
        properties: {
            style: generateCanvas(backgroundColor),
        },
        body: generateElements(primaryColor, primaryElementsCount, secondaryColor, secondaryElementsCount)
    };

    let htmlNode = compile(complexTag);

    let image = await nodeHtmlToImage({
        output: './artifacts/outArtBot/image.png',
        html: htmlNode
        })
        .then(() => console.log('The image was created successfully!'))
}


module.exports = { generateHtmlImage }