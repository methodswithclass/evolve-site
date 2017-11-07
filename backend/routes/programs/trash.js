

var trashExpress = require("express");
var trashRouter = trashExpress.Router();

var get = require("../../evolve/data/get/get.js");
// var environment = require("../../evolve/programs/trash/environment.js");

var db = require("../db.js");

var trashFact = get.programs("trash", "trash");


trashRouter.post("/simulate", function (req, res, next) {


	console.log("simulate step", req.body);

	var result = trash.simulate(req.body.i);

	res.json({result:result});

})


// trashRouter.get("/environment/create", function (req, res, next) {


// 	console.log("create environment", req.body);

// 	var env = get.programs("trash").createEnvironment();

// 	res.json({env:env});

// })


trashRouter.get("/environment/refresh", function (req, res, next) {


	console.log("create environment");

	// environment.trash();

	// var env = environment.get();

	var env = trash.refresh();

	res.json({env:env});

})


// trashRouter.get("/environment/gettrash", function (req, res, next) {


// 	console.log("create environment", req.body);

// 	var trash = environment.trash();

// 	res.json({trash:trash});

// })


trashRouter.get("/environment/reset", function (req, res, next) {


	console.log("reset environment");

	// get.programs("trash").reset();

	trash.reset();

	res.json({success:"individual successfully instructed"});

})


module.exports = trashRouter;





