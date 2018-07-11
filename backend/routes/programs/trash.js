

var trashExpress = require("express");
var trashRouter = trashExpress.Router();

var get = require("../../evolve-app/data/get/get.js");


var db = require("../db.js");


trashRouter.post("/simulate", function (req, res, next) {


	console.log("simulate step", req.body);

	var trash = get.getSessionProgram(req.body.session, "trash");

	var result = trash.simulate(req.body.i);

	res.json({result:result});

})


trashRouter.post("/environment/refresh", function (req, res, next) {

	var input = req.body.input;

	console.log("create environment, input", input.programInput);

	var trash = get.getSessionProgram(input.session, "trash");

	// console.log("program", trash ? 1 : 0);

	var env = trash.refresh(input.programInput);

	// console.log("env", env);
	

	res.json({env:env});

})


trashRouter.post("/environment/reset", function (req, res, next) {


	console.log("reset environment");

	var trash = get.getSessionProgram(req.body.input.session, "trash");

	trash.reset();

	res.json({success:"individual successfully instructed"});

})


module.exports = trashRouter;





