

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

		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			// console.log("get data req", msg.data.input.name);

			// res.status(200).json({data:get.data(msg.data.input.name)})

			var result = {data:get.data(msg.data.input.name)};

			ws.send(JSON.stringify(result));


		});

	}
	catch (err) {

		next(err);
	}
})


evolveRouter.ws("/instantiate", function (ws, req, next) {

	try {


		

		// var session = uidgen.generateSync();

		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			// console.log("instantiate", msg);

			var session = get.createSessionEvolve();

			// res.status(200).json({session:session.id, success:"success"});

			var result = {session:session.id, success:"success"};

			ws.send(JSON.stringify(result));

		});

	}
	catch (err) {

		next(err);
	}

});


evolveRouter.ws("/initialize", function (ws, req, next) {

	try {

		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			console.log("initialize", msg);



			var input = msg.data.input;

			// var input = addProgram(msg.data.input);

			var session = get.getSessionEvolve(input.session);

			var program = get.getSessionProgram(input.session, input.name, input);

			input.pdata = program.pdata;

			let success = session.evolve.initialize(input);

			// res.status(200).json({session:session.id, success:success});

			var result = {session:session.id, success:success};

			ws.send(JSON.stringify(result));

		});

	}
	catch (err) {

		next(err);
	}
});



evolveRouter.ws("/set", function (ws, req, next) {


	try {

		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			var input = msg.data.input;

			// console.log("input is, during set input\n", input, "\n");
			// console.log("set input\n", inputArray);

			var session = get.getSessionEvolve(msg.data.input.session);

			session.evolve.set(msg.data.input);

			// res.status(200).json({session:session.id, success:"success"});

			var result = {session:session.id, success:"success"}

			ws.send(JSON.stringify(result));

		});

	}
	catch (err) {

		next(err);
	}

});



evolveRouter.ws("/run", function (ws, req, next) {


	try {


		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			console.log("run evolve", msg.data.input);

			// var input = addProgram(req);

			var session = get.getSessionEvolve(msg.data.input.session);

			let success = session.evolve.run(msg.data.input);

			// res.status(200).json({success:success, running:true});


			var result = {success:success, running:true};


			ws.send(JSON.stringify(result));
		});


	}
	catch (err) {

		next(err);
	}
});


evolveRouter.ws("/running", function (ws, req, next) {


	try {

		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			// console.log("check running", msg.data, evolution.running());


			var session = get.getSessionEvolve(msg.data.input.session);

			// res.status(200).json({running:session.evolve.running()});

			var result = {running:session.evolve.running()}

			ws.send(JSON.stringify(result));

		});

	}
	catch (err) {

		next(err);
	}
})


evolveRouter.ws("/best", function (ws, req, next) {


	try {

		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			// console.log("get best");

			var session = get.getSessionEvolve(msg.data.input.session);

			// res.status(200).json({ext:session.evolve.getBest()});


			var result = {ext:session.evolve.getBest()};

			ws.send(JSON.stringify(result));
		});

	}
	catch (err) {

		next(err);
	}
})



evolveRouter.ws("/instruct", function (ws, req, next) {


	try {

		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			// console.log("instruct");

			var clear = msg.data.clear

			var session = get.getSessionEvolve(msg.data.input.session);
			var ext = session.evolve.getBest();
			var prog = get.getSessionProgram(msg.data.input.session, msg.data.input.name, msg.data.input);

			// console.log("instruct best dna", best, best.dna);

			prog.program.instruct(clear ? [] : ext.best.dna);

			// res.status(200).json({success:"program successfully instructed"});

			var result = {success:"program successfully instructed"};

			ws.send(JSON.stringify(result));

		});


	}
	catch (err) {

		next(err);
	}
})



evolveRouter.ws("/stepdata", function (ws, req, next) {


	try {

		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			// console.log("get stepdata");

			// looseEnds(req);

			var program = get.getSessionProgram(msg.data.input.session, msg.data.input.name, msg.data.input);

			var stepdata = program.program.stepdata();

			// console.log("step data", stepdata);

			// res.status(200).json({stepdata:stepdata});


			var result = {stepdata:stepdata}

			ws.send(JSON.stringify(result));

		});

	}
	catch (err) {

		next(err);
	}
})



evolveRouter.ws("/hardStop", function (ws, req, next) {


	try {

		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			console.log("hard stop");

			// var input = addProgram(req);

			var session = get.getSessionEvolve(msg.data.input.session);

			session.evolve.hardStop(msg.data.input);

			// res.status(200).json({success:"success"});


			var result = {success:"success"};


			ws.send(JSON.stringify(result));

		});

	}
	catch (err) {

		next(err);
	}
});




module.exports = evolveRouter;





