

var evolveExpress = require("express");

var evolveRouter = evolveExpress.Router();


var evolve = require("mc-evolve");
// var evolve = require("../_ga/evolve.js");
var get = require("../evolve/data/get/get.js");


var evolution = evolve.module;

var db = require("./db.js");
var Individual = require("../evolve/data/models/individual.js");
var Generation = require("../evolve/data/models/generation.js");


var makeInput = function (req) {

	var input = req.body.input;

	input.program = get.programs(input.name);

	return input;
}


evolveRouter.get("/data/:name", function (req, res, next) {

	console.log("get data req", req.params.name, __dirname);

	res.json({data:get.data(req.params.name)});
})


evolveRouter.post("/initialize", function (req, res, next) {

	console.log("post initialize", req.body);

	var input = makeInput(req);

	evolution.initialize(input);

	res.json({success:"success"});
});



evolveRouter.post("/set", function (req, res, next) {

	console.log("set input", req.body);

	var input = makeInput(req);

	evolution.set(input);

	res.json({success:"success"});
});



evolveRouter.post("/run", function (req, res, next) {

	console.log("run evolve post call", req.body);

	var input = makeInput(req);

	evolution.run(input);

	res.json({success:"success", running:true});
});


evolveRouter.post("/restart", function (req, res, next) {

	console.log("restart evolve post call", req.body);

	var input = makeInput(req);

	evolution.restart(req.body.current, input);

	res.json({success:"success", running:true});
});


evolveRouter.get("/running", function (req, res, next) {

	// console.log("check running", req.body, evolution.running());

	res.json({running:evolution.running()})
})


evolveRouter.get("/best", function (req, res, next) {

	console.log("get best", req.body);

	res.json({ext:evolution.getBest()});
})



evolveRouter.get("/instruct", function (req, res, next) {

	console.log("get best", req.body);

	// var input = makeInput(input);

	evolution.instruct();

	res.json({success:"program successfully instructed"});
})



evolveRouter.get("/stepdata/:name", function (req, res, next) {

	// console.log("get stepdata", req.body, evolution.getstepdata());

	var stepdata = get.programs(req.params.name).stepdata();

	res.json({stepdata:stepdata});
})



evolveRouter.post("/hardStop", function (req, res, next) {

	console.log("hard stop", req.body.input);

	var input = makeInput(req);

	evolution.hardStop(input);

	res.json({success:"success"});
});




module.exports = evolveRouter;





