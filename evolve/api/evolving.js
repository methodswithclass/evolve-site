

var evolveExpress = require("express");

var evolveRouter = evolveExpress.Router();


var evolve = require("mc-evolve");
// var evolve = require("../_ga/evolve.js");
var get = require("../data/get/get.js");


var evolution = evolve.module;

var db = require("./db.js");
var Individual = require("../data/models/individual.js");
var Generation = require("../data/models/generation.js");


// var writeLatestTrashToDatabase = function (latest, complete) {

// 	var individual;

// 	var indis = [];

// 	for (var i in latest.pop) {

// 		individual = new Individual({
// 			index:latest.pop[i].index,
// 			dna:latest.pop[i].dna,
// 			fitness:latest.pop[i].fitness,
// 			runs:latest.pop[i].runs
// 		})

// 		indis.push(individual);
// 	}

// 	var generation = new Generation({
// 		index:latest.index,
// 		best:latest.best,
// 		worst:latest.worst,
// 		individuals:indis
// 	})


// 	generation.save(function (err) {

// 		if (err) {

// 			console.log("Database error while saving generation", err)
// 		}
// 		else {

// 			complete();
// 		}
// 	})

// }


// var writeLatestRecognizeToDatabase = function (latest, complete) {


// 	complete();

// }


// var getLatestTrashFromDatabase = function (req, complete) {


// 	Generation.findOne({"index":req.body.index}, "index best worst individuals", function (err, generation) {

// 		if (err) {

// 			console.log("Database error while getting generation", err);
// 		}
// 		else {

// 			complete(generation);
// 		}

// 	})
// }


// var getLatestRecognizeFromDatabase = function (req, complete) {


// 	complete({});

// }







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


// evolveRouter.post("/latest", function (req, res, next) {

// 	console.log("get latest", req.body);

// 	evolution.setLatest(req.body.latest);

// 	res.json({success:"lastest successfully uploaded"});
	
// })


// evolveRouter.get("/latest", function (req, res, next) {

// 	console.log("get latest", req.body);

// 	res.json({latest:evolution.getLatest()});
	
// })

evolveRouter.get("/best", function (req, res, next) {

	console.log("get best", req.body);

	res.json({ext:evolution.getBest()});
})



evolveRouter.get("/instruct", function (req, res, next) {

	console.log("get best", req.body);

	evolution.instruct();

	res.json({success:"program successfully instructed"});
})



evolveRouter.get("/stepdata/:name", function (req, res, next) {

	// console.log("get stepdata", req.body, evolution.getstepdata());

	var stepdata = get.programs(req.params.name).stepdata();

	res.json({stepdata:stepdata});
})



evolveRouter.get("/hardStop", function (req, res, next) {

	console.log("hard stop", req.body);

	evolution.hardStop();

	res.json({success:"success"});
});




module.exports = evolveRouter;





