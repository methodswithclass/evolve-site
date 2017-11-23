

var recognizeExpress = require("express");

var recognizeRouter = recognizeExpress.Router();


var get = require("../../evolve/data/get/get.js");


// var recognize = get.programs("recognize", "recognize");

recognizeRouter.post("/simulate", function (req, res, next) {


	console.log("run best");

	var recognize = get.getSessionProgram(req.body.session, "recognize");

	recognize.simulate(function (image, output, label) {

		res.json({image:image, output:output, label:label});
	});

})



module.exports = recognizeRouter;