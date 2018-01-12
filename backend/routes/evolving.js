

var evolveExpress = require("express");
var evolveRouter = evolveExpress.Router();

var db = require("./db.js");
const UIDGenerator = require('uid-generator');

// var evolve = require("mc-evolve");
// var evolve = require("../_ga/evolve.js");
var get = require("../evolve-app/data/get/get.js");

const uidgen = new UIDGenerator();

// var evolution;

var addProgram = function (input) {


	console.log("add program input", input);

	var result = get.addProgramToSession(input.session, input.name, input.programInput);

	input.program = result.program;
	input.pdata = result.pdata;

	return input;
}


evolveRouter.post("/data", function (req, res, next) {

	console.log("get data req", req.body.input.name);

	res.json({data:get.data(req.body.input.name)});
})


evolveRouter.get("/instantiate", function (req, res, next) {

	console.log("instantiate");

	var session = uidgen.generateSync();

	get.createSessionEvolve(session);

	res.json({session:session, success:"success"});
});


evolveRouter.post("/initialize", function (req, res, next) {

	console.log("initialize");

	var input = addProgram(req.body.input);

	var evolution = get.getSessionEvolve(input.session);

	let success = evolution.initialize(input);

	res.json({success:success});
});



evolveRouter.post("/set", function (req, res, next) {

	console.log("set input", req.body.input);

	// var input = addProgram(req);

	var evolution = get.getSessionEvolve(req.body.input.session);

	evolution.set(req.body.input);

	res.json({success:"success"});
});



evolveRouter.post("/run", function (req, res, next) {

	console.log("run evolve", req.body.input);

	// var input = addProgram(req);

	var evolution = get.getSessionEvolve(req.body.input.session)

	let success = evolution.run(req.body.input);

	res.json({success:success, running:true});
});


evolveRouter.post("/running", function (req, res, next) {

	// console.log("check running", req.body, evolution.running());

	var evolution = get.getSessionEvolve(req.body.input.session)

	res.json({running:evolution.running()})
})


evolveRouter.post("/best", function (req, res, next) {

	// console.log("get best");

	var evolution = get.getSessionEvolve(req.body.input.session)

	res.json({ext:evolution.getBest()});
})



evolveRouter.post("/instruct", function (req, res, next) {

	console.log("instruct");

	var evolution = get.getSessionEvolve(req.body.input.session)
	var ext = evolution.getBest();
	var prog = get.getSessionProgram(req.body.input.session, req.body.input.name);

	// console.log("instruct best dna", best, best.dna);

	prog.instruct(ext.best.dna);

	res.json({success:"program successfully instructed"});
})



evolveRouter.post("/stepdata", function (req, res, next) {

	// console.log("get stepdata", req.body);

	var program = get.getSessionProgram(req.body.input.session, req.body.input.name);

	var stepdata = program.stepdata();

	// console.log("step data", stepdata);

	res.json({stepdata:stepdata});
})



evolveRouter.post("/hardStop", function (req, res, next) {

	console.log("hard stop");

	// var input = addProgram(req);

	var evolution = get.getSessionEvolve(req.body.input.session)

	evolution.hardStop(req.body.input);

	res.json({success:"success"});
});




module.exports = evolveRouter;





