

var evolveExpress = require("express");
var evolveRouter = evolveExpress.Router();

var db = require("./db.js");
const UIDGenerator = require('uid-generator');

// var evolve = require("mc-evolve");
// var evolve = require("../_ga/evolve.js");
var get = require("../evolve/data/get/get.js");

const uidgen = new UIDGenerator();

// var evolution;

var addProgram = function (req) {

	var program = get.addProgramToSession(req.body.input.session, req.body.name);

	input.program = new program();

	return input;
}


evolveRouter.get("/data/:name", function (req, res, next) {

	console.log("get data req", req.params.name);

	res.json({data:get.data(req.params.name)});
})


evolveRouter.get("/instantiate", function (req, res, next) {

	console.log("instantiate");

	var session = uidgen.generateSync();

	get.createSession(session);

	res.json({session:session, success:"success"});
});


evolveRouter.post("/initialize", function (req, res, next) {

	console.log("initialize");

	var input = addProgram(req);

	var evolution = get.getSession(input.session);

	evolution.initialize(input);

	res.json({success:"success"});
});



evolveRouter.post("/set", function (req, res, next) {

	console.log("set input");

	// var input = addProgram(req);

	var evolution = get.getSession(req.body.input.session);

	evolution.set(req.body.input);

	res.json({success:"success"});
});



evolveRouter.post("/run", function (req, res, next) {

	console.log("run evolve");

	// var input = addProgram(req);

	var evolution = get.getSession(req.body.input.session)

	evolution.run(req.body.input);

	res.json({success:"success", running:true});
});


evolveRouter.post("/restart", function (req, res, next) {

	console.log("restart evolve");

	// var input = addProgram(req);

	var evolution = get.getSession(req.body.input.session)

	evolution.restart(req.body.current, req.body.input);

	res.json({success:"success", running:true});
});


evolveRouter.get("/running/:session", function (req, res, next) {

	// console.log("check running", req.body, evolution.running());

	var evolution = get.getSession(req.params.session)

	res.json({running:evolution.running()})
})


evolveRouter.get("/best/:session", function (req, res, next) {

	console.log("get best");

	var evolution = get.getSession(req.params.session)

	res.json({ext:evolution.getBest()});
})



evolveRouter.get("/instruct/:session", function (req, res, next) {

	console.log("instruct");

	// var input = addProgram(input);

	var evolution = get.getSession(req.params.session)

	evolution.instruct();

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

	var evolution = get.getSession(req.body.input.session)

	evolution.hardStop(input);

	res.json({success:"success"});
});




module.exports = evolveRouter;





