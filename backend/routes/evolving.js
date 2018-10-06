

var evolveExpress = require("express");
var evolveRouter = evolveExpress.Router();

var db = require("./db.js");
const UIDGenerator = require('uid-generator');



var get = require("../evolve-app/data/get/get.js");

const uidgen = new UIDGenerator();



var called = 0;
var check = 0;

var addProgram = function (input) {


	// console.log("add program input", input);

	var result = get.addProgramToSession(input);

	input.program = result.program;
	input.pdata = result.pdata;

	return input;
}

// var looseEnds = function (req) {

// 	var sessions = get.getAllSessions()
// 	var dataArray = [];

// 	for (i in sessions) {
// 		//get program with this name for each sesssion that is still running
// 		dataArray.push({
// 			session:sessions[i],
// 			program:sessions[i].programs[req.body.input.name]
// 		})
// 	}

// 	dataArray.forEach((data) => {
// 		//check if it's stepdata function is being called

// 		check = called++;

// 		if (check == 10) {
// 			check = 0;
// 		}

// 		if (called == 10) {
// 			called = 0;
// 		}


// 		setTimeout(() => {

// 			if (check == called) {

// 				data.program.hardStop(data.session.evolve.input.session);
// 			}
// 		}, 300)

// 	})
// }


evolveRouter.post("/data", function (req, res, next) {

	try {

		console.log("get data req", req.body.input.name);

		res.status(200).json({data:get.data(req.body.input.name)})

	}
	catch (err) {

		next(err);
	}
})


evolveRouter.get("/instantiate", function (req, res, next) {

	try {


		console.log("instantiate");

		// var session = uidgen.generateSync();

		var session = get.createSessionEvolve();

		res.status(200).json({session:session.id, success:"success"});

	}
	catch (err) {

		next(err);
	}

});


evolveRouter.post("/initialize", function (req, res, next) {

	try {

		console.log("initialize");

		var input = addProgram(req.body.input);

		var session = get.getSessionEvolve(input.session);

		let success = session.evolve.initialize(input);

		res.status(200).json({session:session.id, success:success});

	}
	catch (err) {

		next(err);
	}
});



evolveRouter.post("/set", function (req, res, next) {


	try {

		var input = req.body.input;

		console.log("input is, during set input\n", input, "\n");
		// console.log("set input\n", inputArray);

		var session = get.getSessionEvolve(req.body.input.session);

		session.evolve.set(req.body.input);

		res.status(200).json({session:session.id, success:"success"});

	}
	catch (err) {

		next(err);
	}

});



evolveRouter.post("/run", function (req, res, next) {


	try {

		console.log("run evolve", req.body.input);

		// var input = addProgram(req);

		var session = get.getSessionEvolve(req.body.input.session);

		let success = session.evolve.run(req.body.input);

		res.status(200).json({success:success, running:true});


	}
	catch (err) {

		next(err);
	}
});


evolveRouter.post("/running", function (req, res, next) {


	try {

		// console.log("check running", req.body, evolution.running());


		var session = get.getSessionEvolve(req.body.input.session);

		res.status(200).json({running:session.evolve.running()})

	}
	catch (err) {

		next(err);
	}
})


evolveRouter.post("/best", function (req, res, next) {


	try {

		// console.log("get best");

		var session = get.getSessionEvolve(req.body.input.session);

		res.status(200).json({ext:session.evolve.getBest()})

	}
	catch (err) {

		next(err);
	}
})



evolveRouter.post("/instruct", function (req, res, next) {


	try {

		console.log("instruct");

		var clear = req.body.clear

		var session = get.getSessionEvolve(req.body.input.session);
		var ext = session.evolve.getBest();
		var prog = get.getSessionProgram(req.body.input.session, req.body.input.name, req.body.input);

		// console.log("instruct best dna", best, best.dna);

		prog.program.instruct(clear ? [] : ext.best.dna);

		res.status(200).json({success:"program successfully instructed"});


	}
	catch (err) {

		next(err);
	}
})



evolveRouter.post("/stepdata", function (req, res, next) {


	try {

		// console.log("get stepdata", req.body);

		// looseEnds(req);

		var program = get.getSessionProgram(req.body.input.session, req.body.input.name, req.body.input);

		var stepdata = program.program.stepdata();

		// console.log("step data", stepdata);

		res.status(200).json({stepdata:stepdata})

	}
	catch (err) {

		next(err);
	}
})



evolveRouter.post("/hardStop", function (req, res, next) {


	try {

		console.log("hard stop");

		// var input = addProgram(req);

		var session = get.getSessionEvolve(req.body.input.session);

		session.evolve.hardStop(req.body.input);

		res.status(200).json({success:"success"});

	}
	catch (err) {

		next(err);
	}
});




module.exports = evolveRouter;





