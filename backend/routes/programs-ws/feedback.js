

var feedbackExpress = require("express");

var feedbackRouter = recognizeExpress.Router();


var get = require("../../evolve-app/data/get/get.js");



feedbackRouter.ws("/animate", function (ws, req, next) {

	ws.on("message", function ($msg) {

		var msg = JSON.parse($msg);

		var input = msg.data.input;

		var program = get.getSessionProgram(input.session, input.name, input).program;

		program.animate(input.plot, input.direction, input.duration);

	});

});




module.exports  = feedbackRouter