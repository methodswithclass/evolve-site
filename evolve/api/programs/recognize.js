

var recognizeExpress = require("express");

var recognizeRouter = recognizeExpress.Router();


var get = require("../../data/get/get.js");



recognizeRouter.post("/simulate", function (req, res, next) {


	console.log("run best", req.body);

	get.programs(req.body.name).runBest(res.body.bestDNA, function (image, output, label) {

		res.json({image:image, output:output, label:label});
	});

})






module.exports = recognizeRouter;