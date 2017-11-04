

var recognizeExpress = require("express");

var recognizeRouter = recognizeExpress.Router();


var get = require("../../data/get/get.js");


var bestDNA = [];

var spliceChunk = function (chunk) {

	bestDNA = bestDNA.concat(chunk);

}


recognizeRouter.post("/simulate", function (req, res, next) {


	console.log("run best", req.body);

	get.programs(req.body.name).runBest(bestDNA, function (image, output, label) {

		res.json({image:image, output:output, label:label});
	});

})


recognizeRouter.post("/instruct", function (req, res, next) {


	console.log("instruct", req.body);

	spliceChunk(req.body.chunk);

})




module.exports = recognizeRouter;