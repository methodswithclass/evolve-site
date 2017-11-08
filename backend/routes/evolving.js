

var evolveExpress = require("express");
var evolveRouter = evolveExpress.Router();

var db = require("./db.js");
const UIDGenerator = require('uid-generator');

// var evolve = require("mc-evolve");
// var evolve = require("../_ga/evolve.js");
var get = require("../evolve/data/get/get.js");

const uidgen = new UIDGenerator();

// var evolution;

var addProgram = function (input) {

	input.program = get.addProgramToSession(input.session, input.name);

	return input;
}


evolveRouter.get("/data/:name", function (req, res, next) {

	console.log("get data req", req.params.name);

	res.json({data:get.data(req.params.name)});
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

	evolution.initialize(input);

	res.json({success:"success"});
});



evolveRouter.post("/set", function (req, res, next) {

	console.log("set input", req.body.input);

	// var input = addProgram(req);

	var evolution = get.getSessionEvolve(req.body.input.session);

	evolution.set(req.body.input);

	res.json({success:"success"});
});



evolveRouter.post("/run", function (req, res, next) {

	console.log("run evolve");

	// var input = addProgram(req);

	var evolution = get.getSessionEvolve(req.body.input.session)

	evolution.run(req.body.input);

	res.json({success:"success", running:true});
});


evolveRouter.post("/restart", function (req, res, next) {

	console.log("restart evolve");

	// var input = addProgram(req);

	var evolution = get.getSessionEvolve(req.body.input.session)

	evolution.restart(req.body.current, req.body.input);

	res.json({success:"success", running:true});
});


evolveRouter.get("/running/:session", function (req, res, next) {

	// console.log("check running", req.body, evolution.running());

	var evolution = get.getSessionEvolve(req.params.session)

	res.json({running:evolution.running()})
})


evolveRouter.get("/best/:session", function (req, res, next) {

	console.log("get best");

	var evolution = get.getSessionEvolve(req.params.session)

	res.json({ext:evolution.getBest()});
})



evolveRouter.get("/instruct/:name/:session", function (req, res, next) {

	console.log("instruct");

	var evolution = get.getSessionEvolve(req.params.session)
	var best = evolution.getBest();
	var trash = get.getSessionProgram(req.params.session, req.params.name);

	trash.instruct(best.dna);

	res.json({success:"program successfully instructed"});
})



evolveRouter.get("/stepdata/:name/:session", function (req, res, next) {

	// console.log("get stepdata", req.body, evolution.getstepdata());

	var program = get.getSessionProgram(req.params.session, req.params.name);

	var stepdata = program.stepdata();

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





