const nodeHtmlToImage = require('node-html-to-image');
const compile = require('hyperjs').compile;

var canvasWidth, canvasHeight;

const generateCanvas = (backgroundColor) => {
    canvasWidth = getRandomArbitrary(100, 400);
    canvasHeight = getRandomArbitrary(100, 400);

    return 'background-color:' + backgroundColor + '; width:' + canvasWidth + 'px; height:' + canvasHeight + 'px;';
}

const generateRandomElementStyle = (color) => {
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

const generatePolarElementStyle = (color, point) => {
    let returnString;

    // determine random width and height
    let width = 10;
    let height = 10;

    // determine random position
    let top = getRandomArbitrary(point.y - 5, point.y + 5);
    let left = getRandomArbitrary(point.x - 5, point.y + 5);

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

const getPolarOppositePoint = (point) => {
    return {
        x: canvasWidth - point.x,
        y: canvasHeight - point.y
    };
}

const generateRandomElement = (color) => {
    return {
        tag: 'div',
        properties: {
            style: generateRandomElementStyle(color)
        }
    }
}

const generatePolarElement = (color, point) => {
    return {
        tag: 'div',
        properties: {
            style: generatePolarElementStyle(color, point)
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

const generateRandomElements = (primaryColor, secondaryColor) => {
    let primaryElementsCount = getRandomArbitrary(3, 8);
    let secondaryElementsCount = getRandomArbitrary(3, 8);

    let elementsArray = [];
    for (let i = 0; i < primaryElementsCount; i++) {
        elementsArray.push(generateRandomElement(primaryColor));
    }
    for (let i = 0; i< secondaryElementsCount; i++) {
        elementsArray.push(generateRandomElement(secondaryColor));
    }

    return shuffleArray(elementsArray);
}

const generatePolarElements = (primaryColor, secondaryColor) => {
    let randomPoint = {
        x: getRandomArbitrary(20, canvasWidth-20),
        y: getRandomArbitrary(20, canvasHeight-20)
    };
    let polarOpposite = getPolarOppositePoint(randomPoint);

    let elementsArray = [];
    for (let i = 0; i < 20; i++) {
        elementsArray.push(generatePolarElement(primaryColor, randomPoint));
    }
    for (let i = 0; i< 20; i++) {
        elementsArray.push(generatePolarElement(secondaryColor, polarOpposite));
    }
}

const generateHtmlImage = (tweetCallback) => {

    let backgroundColor = getRandomColor();
    let primaryColor = getRandomColor();
    let secondaryColor = getRandomColor();

    var complexTag;
    let randomAbstract = true;
    if (randomAbstract) {
        complexTag = {
                tag: 'body',
                properties: {
                    style: generateCanvas(backgroundColor),
                },
                body: generateRandomElements(primaryColor, secondaryColor)
            };
    }
    else
    {
        complexTag = {
            tag: 'body',
            properties: {
                style: generateCanvas(backgroundColor),
            },
            body: generatePolarElements(primaryColor, secondaryColor)
        };
    }

    let htmlNode = compile(complexTag);

    nodeHtmlToImage({
        output: './artifacts/outArtBot/image.png',
        html: htmlNode
        })
        .then(() => console.log('The image was created successfully!'))
}


module.exports = { generateHtmlImage }