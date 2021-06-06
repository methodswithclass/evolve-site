

var recognizeExpress = require("express");

var recognizeRouter = recognizeExpress.Router();


var get = require("../../evolve-app/data/get/get.js");

var imageReader = require("../../evolve-app/programs/recognize/image-reader.js");


// var recognize = get.programs("recognize", "recognize");

recognizeRouter.ws("/simulate", function (ws, req, next) {


	try {

		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			console.log("run best");

			var recognize = get.getSessionProgram(msg.data.input.session, "recognize");

			recognize.simulate(msg.data.index, function (output) {

				// res.status(200).json({output:output});
			
				var result = {output:output};

				ws.send(JSON.stringify(result));
			});

		});

	}
	catch (err) {

		next(err);
	}

})



recognizeRouter.ws("/digit", function (ws, req, next) {


	try {


		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);


			console.log("get digit");

			// var recognize = get.getSessionProgram(msg.data.input.session, "recognize");

			var data = get.getData(msg.data.input.name);

			var image;


			imageReader.readfile(data.data.dataFile, function ($data) {

				image = $data.find(function (p) {

					return p.index == msg.data.index
				})

				// res.status(200).json({image:image.pixels, index:image.index, label:image.label});

				var result = {image:image.pixels, index:image.index, label:image.label};

				ws.send(JSON.stringify(result));

			})

		});


		// recognize.simulate(function (image, output, label) {

		// 	res.json({image:image, output:output, label:label});
		// });

	}
	catch (err) {

		next(err);
	}

})


module.exports = recognizeRouter;