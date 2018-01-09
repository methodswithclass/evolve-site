
var imageprocessor = require("../../programs/recognize/image-reader.js");

var imageWidth = 28;
var imageHeight = 28;
var imageLength = imageWidth*imageHeight;

var network = [
{
	nodes:imageLength
},
{
	nodes:16
},
{
	nodes:10
}
]


var env = {
	dev:"dev",
	prod:"prod"
}

var environment = "dev";
// var environment = "prod";

var kaggleTrainString = (environment == env.dev ? "dist/" : "" ) + "assets/data/kaggle/train.csv";


var recognizeGenome = function (network) {

	var total = 0;

	for (var i = 1; i < network.length; i++) {

		total += (network[i-1].nodes + 1)*network[i].nodes;
	}

	return total;
}

var recognizeObjToArray = function (dnaObj) {

	var dnaArray = [];

	for (var i in dnaObj) {

		for (var j in dnaObj[i]) {

			for (var k in dnaObj[i][j]["weights"]) {

				dnaArray.push(dnaObj[i][j]["weights"][k]);

			}

			dnaArray.push(dnaObj[i][j]["bias"]);
		}
	}

	return dnaArray;

}

var recognizeArrayToObject = function (dnaArray) {

	// console.log("inside array to object", dnaArray);

	var dnaObj = [];
	// dnaObj.push([]);
	var m = 0;
	var weights = [];

	// console.log("network length", imageRecognize.network.length);

	for (var i = 1; i < network.length; i++) {

		dnaObj.push([]);

		// console.log("layer", i, dnaObj);

		for (var j = 0; j < network[i].nodes; j++) {

			dnaObj[i-1].push([]);

			// console.log("node with weight", i, j, dnaArray[m]);

			weights = [];

			for (var k = 0; k < network[i-1].nodes; k++) {
				
				weights.push(dnaArray[m++]);

				if (k == network[i-1].nodes - 1) {

					dnaObj[i-1][j]["bias"] = dnaArray[m++];

					dnaObj[i-1][j]["weights"] = weights;

					// console.log("weights", weights);
				}
			}
			
		}
		
	}

	// console.log("array to object, dna obj", dnaObj);

	return dnaObj;
}


var data = {
	name:"recognize",
	goals:[{goal:"max"}, {goal:"min"}],
	genome:recognizeGenome(network),
	width:imageWidth,
	height:imageHeight,
	length:imageLength,
	network:network,
	dataFile:kaggleTrainString
}

var getImages = function () {

	// console.log("get images");

	imageprocessor.readfile(kaggleTrainString, function (result) {

		// console.log(result);

		data.images = result;

		// console.log("images length", images.length);
	})
}


getImages();


module.exports = {
	data:data,
	recognizeGenome:recognizeGenome,
	recognizeArrayToObject:recognizeArrayToObject,
	recognizeObjToArray:recognizeObjToArray
}