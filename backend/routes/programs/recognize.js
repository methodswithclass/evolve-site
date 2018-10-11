

var recognizeExpress = require("express");

var recognizeRouter = recognizeExpress.Router();


var get = require("../../evolve-app/data/get/get.js");

var imageReader = require("../../evolve-app/programs/recognize/image-reader.js");


// var recognize = get.programs("recognize", "recognize");

recognizeRouter.post("/simulate", function (req, res, next) {


	try {

		console.log("run best");

		var recognize = get.getSessionProgram(req.body.input.session, "recognize");

		recognize.simulate(req.body.index, function (output) {

			res.status(200).json({output:output});
		});

	}
	catch (err) {

		next(err);
	}

})



recognizeRouter.post("/digit", function (req, res, next) {


	try {


		console.log("get digit");

		// var recognize = get.getSessionProgram(req.body.input.session, "recognize");

		var data = get.getData(req.body.input.name);

		var image;


		imageReader.readfile(data.data.dataFile, function ($data) {

			image = $data.find(function (p) {

				return p.index == req.body.index
			})

			res.status(200).json({image:image.pixels, index:image.index, label:image.label});

		})


		// recognize.simulate(function (image, output, label) {

		// 	res.json({image:image, output:output, label:label});
		// });

	}
	catch (err) {

		next(err);
	}

})


module.exports = recognizeRouter;