

var trashExpress = require("express");
var trashRouter = trashExpress.Router();

var get = require("../../data/get/get.js");
var environment = require("../../programs/trash/environment.js");

var db = require("../db.js");


// var Individual = require("../../data/models/individual.js");
// var Generation = require("../../data/models/generation.js");



trashRouter.post("/simulate", function (req, res, next) {


	console.log("simulate step", req.body);

	var result = get.programs(req.body.name).simulate(req.body.i);

	res.json({result:result});

})


trashRouter.get("/environment/create", function (req, res, next) {


	console.log("create environment", req.body);

	environment.arena();

	res.json({success:"environment created successfully"});

})


trashRouter.get("/environment/refresh", function (req, res, next) {


	console.log("create environment", req.body);

	environment.trash();

	var env = environment.get();

	res.json({env:env});

})


trashRouter.get("/environment/gettrash", function (req, res, next) {


	console.log("create environment", req.body);

	var trash = environment.trash();

	res.json({trash:trash});

})


trashRouter.post("/instruct", function (req, res, next) {


	console.log("instruct individual", req.body);

	get.programs("trash").instruct(req.body.genome);

	res.json({success:"individual successfully instructed"});

})


trashRouter.get("/environment/reset", function (req, res, next) {


	console.log("reset environment", req.body);

	get.programs("trash").reset();

	res.json({success:"individual successfully instructed"});

})


module.exports = trashRouter;





