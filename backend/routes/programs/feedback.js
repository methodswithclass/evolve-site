

var feedbackExpress = require("express");

var feedbackRouter = recognizeExpress.Router();


var get = require("../../evolve-app/data/get/get.js");



feedbackRouter.post("/animate", function (req, res, next) {

	var input = req.body.input;

	var program = get.getSessionProgram[input.session].program[input.name];

	program.animate(input.plot, input.direction, input.duration);

});




module.exports  = feedbackRouter