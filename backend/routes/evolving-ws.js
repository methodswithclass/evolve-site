

var evolveExpress = require("express");
var evolveRouter = evolveExpress.Router();

var db = require("./db.js");
const UIDGenerator = require('uid-generator');



var get = require("../evolve-app/data/get/get.js");

const uidgen = new UIDGenerator();



var called = 0;
var check = 0;



evolveRouter.ws("/data", function (ws, req, next) {

	try {

		ws.on("message", function (msg) {

			console.log("get data req", req.body.input.name);

			// res.status(200).json({data:get.data(req.body.input.name)})

			ws.send({data:get.data(msg.data.input.name)});


		});

	}
	catch (err) {

		next(err);
	}
})


evolveRouter.ws("/instantiate", function (ws, req, next) {

	try {


		console.log("instantiate");

		// var session = uidgen.generateSync();

		ws.on("message", function (msg) {

			var session = get.createSessionEvolve();

			// res.status(200).json({session:session.id, success:"success"});

			ws.send({session:session.id, success:"success"})

		});

	}
	catch (err) {

		next(err);
	}

});


evolveRouter.ws("/initialize", function (ws, req, next) {

	try {

		ws.on("message", function (msg) {

			console.log("initialize");



			var input = req.body.input;

			// var input = addProgram(req.body.input);

			var session = get.getSessionEvolve(input.session);

			var program = get.getSessionProgram(input.session, input.name, input);

			input.pdata = program.pdata;

			let success = session.evolve.initialize(input);

			// res.status(200).json({session:session.id, success:success});

			ws.send({session:session.id, success:success})

		});

	}
	catch (err) {

		next(err);
	}
});



evolveRouter.ws("/set", function (ws, req, next) {


	try {

		ws.on("message", function (msg) {

			var input = req.body.input;

			console.log("input is, during set input\n", input, "\n");
			// console.log("set input\n", inputArray);

			var session = get.getSessionEvolve(req.body.input.session);

			session.evolve.set(req.body.input);

			// res.status(200).json({session:session.id, success:"success"});

			ws.send({session:session.id, success:"success"})

		});

	}
	catch (err) {

		next(err);
	}

});



evolveRouter.ws("/run", function (ws, req, next) {


	try {


		ws.on("message", function (msg) {

			console.log("run evolve", req.body.input);

			// var input = addProgram(req);

			var session = get.getSessionEvolve(req.body.input.session);

			let success = session.evolve.run(req.body.input);

			// res.status(200).json({success:success, running:true});


			ws.send({success:success, running:true})
		});


	}
	catch (err) {

		next(err);
	}
});


evolveRouter.ws("/running", function (ws, req, next) {


	try {

		ws.on("message", function (msg) {

			// console.log("check running", req.body, evolution.running());


			var session = get.getSessionEvolve(req.body.input.session);

			// res.status(200).json({running:session.evolve.running()});

			ws.send({running:session.evolve.running()})

		});

	}
	catch (err) {

		next(err);
	}
})


evolveRouter.ws("/best", function (ws, req, next) {


	try {

		ws.on("message", function (msg) {

			// console.log("get best");

			var session = get.getSessionEvolve(req.body.input.session);

			// res.status(200).json({ext:session.evolve.getBest()});


			ws.send({ext:session.evolve.getBest()})
		});

	}
	catch (err) {

		next(err);
	}
})



evolveRouter.ws("/instruct", function (ws, req, next) {


	try {

		ws.on("message", function (msg) {

			console.log("instruct");

			var clear = req.body.clear

			var session = get.getSessionEvolve(req.body.input.session);
			var ext = session.evolve.getBest();
			var prog = get.getSessionProgram(req.body.input.session, req.body.input.name, req.body.input);

			// console.log("instruct best dna", best, best.dna);

			prog.program.instruct(clear ? [] : ext.best.dna);

			// res.status(200).json({success:"program successfully instructed"});

			ws.send({success:"program successfully instructed"})

		});


	}
	catch (err) {

		next(err);
	}
})



evolveRouter.ws("/stepdata", function (ws, req, next) {


	try {

		ws.on("message", function (msg) {

			console.log("get stepdata");

			// looseEnds(req);

			var program = get.getSessionProgram(req.body.input.session, req.body.input.name, req.body.input);

			var stepdata = program.program.stepdata();

			// console.log("step data", stepdata);

			// res.status(200).json({stepdata:stepdata});


			ws.send({stepdata:stepdata})

		});

	}
	catch (err) {

		next(err);
	}
})



evolveRouter.ws("/hardStop", function (ws, req, next) {


	try {

		ws.on("message", function (msg) {

			console.log("hard stop");

			// var input = addProgram(req);

			var session = get.getSessionEvolve(req.body.input.session);

			session.evolve.hardStop(req.body.input);

			// res.status(200).json({success:"success"});


			ws.send({success:"success"})

		});

	}
	catch (err) {

		next(err);
	}
});




module.exports = evolveRouter;





