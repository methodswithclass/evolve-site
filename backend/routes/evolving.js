

var evolveExpress = require("express");
var evolveRouter = evolveExpress.Router();

var db = require("./db.js");

// var evolve = require("mc-evolve");
// var evolve = require("../_ga/evolve.js");
var get = require("../evolve/data/get/get.js");

var evolution;

var makeInput = function (req) {

	var input = req.body.input;

	var program = get.programs(input.name, input.name);

	input.program = new program();

	return input;
}


evolveRouter.get("/data/:name", function (req, res, next) {

	console.log("get data req", req.params.name);

	res.json({data:get.data(req.params.name)});
})


evolveRouter.post("/instantiate", function (req, res, next) {

	console.log("post initialize");

	evolution = get.createSession(req.body.session);

	res.json({success:"success"});
});


evolveRouter.post("/initialize", function (req, res, next) {

	console.log("post initialize");

	var input = makeInput(req);

	evolution.initialize(input);

	res.json({success:"success"});
});



evolveRouter.post("/set", function (req, res, next) {

	console.log("set input");

	var input = makeInput(req);

	evolution.set(input);

	res.json({success:"success"});
});



evolveRouter.post("/run", function (req, res, next) {

	console.log("run evolve");

	var input = makeInput(req);

	evolution.run(input);

	res.json({success:"success", running:true});
});


evolveRouter.post("/restart", function (req, res, next) {

	console.log("restart evolve");

	var input = makeInput(req);

	evolution.restart(req.body.current, input);

	res.json({success:"success", running:true});
});


evolveRouter.get("/running", function (req, res, next) {

	// console.log("check running", req.body, evolution.running());

	res.json({running:evolution.running()})
})


evolveRouter.get("/best", function (req, res, next) {

	console.log("get best");

	res.json({ext:evolution.getBest()});
})



evolveRouter.get("/instruct", function (req, res, next) {

	console.log("instruct");

	// var input = makeInput(input);

	evolution.instruct();

	res.json({success:"program successfully instructed"});
})



evolveRouter.get("/stepdata/:name", function (req, res, next) {

	// console.log("get stepdata", req.body, evolution.getstepdata());

	var stepdata = get.programs(req.params.name, req.params.name).stepdata();

	res.json({stepdata:stepdata});
})



evolveRouter.post("/hardStop", function (req, res, next) {

	console.log("hard stop");

	var input = makeInput(req);

	evolution.hardStop(input);

	res.json({success:"success"});
});




module.exports = evolveRouter;





