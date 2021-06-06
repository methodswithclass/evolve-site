

var trashExpress = require("express");
var trashRouter = trashExpress.Router();

var get = require("../../evolve-app/data/get/get.js");


var db = require("../db.js");


trashRouter.ws("/simulate", function (ws, req, next) {


	try {

		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			console.log("simulate step", msg.data);

			var trash = get.getSessionProgram(msg.data.options.session, "trash", msg.data.input).program;

			var result = trash.simulate();

			// res.json({result:result})


			var $result = {result:result};

			ws.send(JSON.stringify($result));

		});


	}
	catch (err) {

		next(err);
	}

})


trashRouter.ws("/environment/refresh", function (ws, req, next) {


	try {

		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			var input = msg.data.input;

			// console.log("create environment, input", input.programInput);

			var trash = get.getSessionProgram(input.session, "trash", input).program;

			var env = trash.refresh(input.programInput);

			// console.log("env", input.programInput, env);
			

			// res.json({env:env});

			var result = {env:env};

			ws.send(JSON.stringify(result));

		});


	}
	catch (err) {

		next(err);
	}

})


trashRouter.ws("/environment/reset", function (ws, req, next) {


	try {

		ws.on("message", function ($msg) {

			var msg = JSON.parse($msg);

			console.log("reset environment", msg);

			var trash = get.getSessionProgram(msg.data.input.session, "trash", msg.data.input).program;

			// trash.reset();

			var env = trash.reset(0);

			// res.json({env:env})

			var result = {env:env}

			ws.send(JSON.stringify(result));

		});

	}
	catch (err) {

		next(err);
	}

})


module.exports = trashRouter;





