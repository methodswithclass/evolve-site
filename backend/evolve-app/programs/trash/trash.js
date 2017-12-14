
var robotFact = require("./robot.js");
var environmentFact = require("./environment.js");
var d = require("../../data/programs/trash.js");
var g = require("mc-shared").utility_service;



var trash = function (options) {

	var self = this;


	var actions = d.data.actions;
	var runs;
	var $stepdata;

	var running = false;

	var input;

	var robot = new robotFact();
	var environment = new environmentFact();
	
	// console.log("trash create, environment create options", options);

	environment.refresh(options);
	robot.setup(environment, options);


	self.gene = function () {
		// console.log("get gene");
		return Math.floor(Math.random()*actions.list.length);
	}

	self.instruct = function (genome) {
		
		// console.log("instruct robot");
		robot.instruct(genome);
		robot.reset();
	}

	var getPoints = function (result) {

		var action = result.action;
		var success = result.success;

		if (success == "success") {
			return action.points.success;
		}
		else {
			//console.log("fail: ", action.points.fail);
			return action.points.fail;
		}

		return 0;
	}

	self.hardStop = function () {

		runs = 0;
	}

	self.reset = function () {
		
		environment.reset();
		robot.reset();
	}

	self.refresh = function (options) {

		environment.refresh(options);
		self.reset();

		return environment.get();
	}

	self.stepdata = function () {

		return $stepdata;
	}

	var performStep = function (step, fit, run, params, each, complete) {

		//console.log("step", step);

		if (step < options.totalSteps) {

			var after = robot.update();

			$stepdata = {
				name:"step." + input.name,
				gen:params.gen,
				org:params.index,
				run:run,
				step:step
			}

			var _fit = each(fit, after);

			performStep(step + 1, _fit, run, params, each, complete);

		}
		else {
			complete(fit);
		}
	}

	var performRun = function (run, fits, params, each, complete) {

		//console.log("run", run);

		if (run < runs) {

			var fit = 0;
			var step = 0;
			var target = 0;
			var running = true;
			var after;

			self.instruct(params.dna);

			if (params.input.newenv) {

				target = environment.refresh(params.input.programInput);
			}
			else {
				environment.trash();
			}

			performStep(0, 0, run, params, 
				function (fit, x) {

					fit += getPoints(x);

					return fit;
				}, 
				function (x) {

					var _fits = each(fits, {fit:x, target:target});
					performRun(run + 1, _fits, params, each, complete);
				}
			);

		}
		else {
			complete(fits);
		}
		
	}

	self.run = function (params, complete) {

		var self = this;

		input = params.input;

		runs = input.runs;

		var fits = [];
		var avgfit;

		performRun(0, fits, params,
			function (fits, x) {

				//console.log("fits", ...fits, "fit", x);

				fits[fits.length] = x;

				return fits;
			},
			function (fits) {

				avgfit = g.truncate(g.average(fits, function (value, index, array) {return value.fit;}),2)


				var count = 0;
				for (i in fits) {
					if (fits[i].fit >= fits[i].target*actions.list[5].points.success) {
						count++;
					}
				}

				var success = count > fits.length*0.8;

				complete({
					runs:fits,
					avg:avgfit,
					success:success
				});

			}
		);
		
	}

	self.simulate = function (i) {

		console.log(" ");
		var after = robot.update();
		var points = getPoints(after);

		var result = {
			i:i,
			after:after,
			points:points
		}

		// console.log("simulate result", result);

		return result;
	}


}

module.exports = trash


