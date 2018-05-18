
var imageprocessor = require("../../programs/recognize/image-reader.js");

var imageWidth = 28;
var imageHeight = 28;
var imageLength = imageWidth*imageHeight;

var network = [
{
	index:0,
	nodes:imageLength
},
{
	index:1,
	nodes:30
},
{
	index:2,
	nodes:15
},
{
	index:3,
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

		total += (network[i-1].nodes)*network[i].nodes;
	}

	return total;
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
	recognizeGenome:recognizeGenome
}