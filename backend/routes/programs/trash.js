

var trashExpress = require("express");
var trashRouter = trashExpress.Router();

var get = require("../../evolve/data/get/get.js");


var db = require("../db.js");


trashRouter.post("/simulate", function (req, res, next) {


	console.log("simulate step", req.body);

	var trash = get.getSessionProgram(req.body.session, "trash");

	var result = trash.simulate(req.body.i);

	res.json({result:result});

})


trashRouter.get("/environment/refresh/:session", function (req, res, next) {


	console.log("create environment");

	var trash = get.getSessionProgram(req.params.session, "trash");

	// console.log("program", trash ? 1 : 0);

	var env = trash.refresh();

	// console.log("env", env);

	res.json({env:env});

})


trashRouter.get("/environment/reset/:session", function (req, res, next) {


	console.log("reset environment");

	var trash = get.getSessionProgram(req.params.session, "trash");

	trash.reset();

	res.json({success:"individual successfully instructed"});

})


module.exports = trashRouter;





