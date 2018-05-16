
var robotFact = require("../robot.js");
var environmentFact = require("../environment.js");
var d = require("../../../data/programs/trash.js");
var g = require("mc-shared").utility_service;
// var g = require("../../../__ga/shared.js").utility_service;
var Worker = require("webworker-threads").Worker;


var trash = function (options) {

	var self = this;


	var actions = d.data.actions;
	var runs;
	var run = 0;
	var $stepdata;

	var running = false;
	var fits = [];
	var avgfit = 0;
	var success;
	var fitness = 0;
	var step = 0;
	var target = 0;

	var input;

	var simulation = {};

	var env = {};
	var envIndex = 0;


	var types = {
		recursive:"recursive",
		loop:"loop",
		async:"async",
		worker:"worker"
	}

	var type = options.processType;
	var envObj = true;

	// console.log("trash options run type",  type);

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


	var createRunEnvironment = function () {

		var env = function ($options) {

			var self = this;

			self.robot = new robotFact();
			self.environment = new environmentFact();
			
			self.setup = function($options) {

				self.robot.setup(self.environment, $options);
			}

			self.reset = function () {

				self.environment.reset();
				self.robot.reset();
			}


			self.refresh = function ($options) {

				var target = self.environment.refresh($options);
				self.setup($options);

				return target;
			}

			self.get = function () {

				return self.environment.get();
			}


			self.instruct = function (genome) {

				self.robot.instruct(genome);
				self.robot.reset();
			}


			self.update = function(i) {

				var after = self.robot.update();

				var points = getPoints(after);

				return {
					i:i,
					after:after,
					points:points
				}

			}
		}

		return new env(options);


	}


	var makeEnvironments = function (runs) {

		var envIndex = 0

		while (envIndex <= runs) {

			env[envIndex] = createRunEnvironment();

			// console.log("environment", envIndex, "created");

			envIndex++;

		}

	}

	var refreshAllEnvironments = function (runs) {


		var envIndex = 0

		while (envIndex <= runs) {

			env[envIndex].refresh();

			console.log("environment", envIndex, "reset");

			envIndex++;

		}
	}


	self.gene = function () {
		// console.log("get gene");
		return Math.floor(Math.random()*actions.list.length);
	}

	self.hardStop = function () {

		runs = 0;
	}

	self.stepdata = function () {

		return $stepdata;
	}


	var performStep = function ($step, $run, fit, params, env) {


		if ($step < options.totalSteps) {

			// console.log("indi", params.index, "$run", $run, "step", $step);

			var result = env.update();

			$stepdata = {
				name:"step." + input.name,
				gen:params.gen,
				org:params.index,
				run:$run,
				step:$step
			}

			// console.log("fit inside", fit);

			return performStep($step + 1, $run, fit + result.points, params, env);

		}
		else {
			// console.log("fit return", fit);
			return fit;
		}

	}


	var performRun = function ($run, params, complete) {


		var fits = [];

		var doRun = function ($$run, params) {

			
			return new Promise(function (resolve, reject) {


				target = env[$$run.toString()].refresh(params.input.programInput);

				env[$$run.toString()].instruct(params.dna);

				var fit = performStepAsync(0, $$run, 0, params, env[$$run.toString()]);


				return resolve({fitness:fit, target:target});

			})

		}


		// self.instruct(params.dna);


		running = true;

		while ($run <= runs) {

			doRun($run, params)
			.then(function (fit) {

				fits.push(fit);

				// console.log("fits length", fits.length, runs);

				if (fits.length == runs) {

					complete(fits);
				}

			})
			.catch(function (err) {

				console.log("Error in promise:", err);
			})

			$run++;

		}
	
	}

	self.run = function (params, complete) {


		var self = this;

		input = params.input;
		runs = input.runs;

		run = 0;

		fits.length = 0;
		fits = null;
		fits = [];


		if (params.gen == 1) {

			makeEnvironments(runs);
		}
		else {
			refreshAllEnvironments(runs);
		}



		performRun(0, params, 
		    function (fits) {

				avgfit = g.avgArray({
					array:fits,
					value:"fitness",
					truncate:2
				});

				var count = 0;
				for (i in fits) {
					if (fits[i].fitness >= fits[i].target*actions.list[5].points.success) {
						count++;
					}
				}

				// var success = count > fits.length*0.8;
				var success = false;

				complete({
					runs:fits,
					avg:avgfit,
					success:success
				});

			}
		);


		

	}

	self.reset = function () {
		
		// env.reset();
		// robot.reset();

		simulation.reset();
	}

	self.refresh = function (options) {

		// env.refresh(options);
		// robot.setup(env, options);

		simulation.refresh(options);
		self.reset();

		return simulation.get();
	}

	self.instruct = function (genome) {
		
		console.log("instruct robot");
		// robot.instruct(genome);
		// robot.reset();

		simulation.instruct(genome);
	}

	self.simulate = function (i) {

		// console.log("simulate result", result);

		return simulation.update(i);
	}

	self.createSimulation = function (options) {


		simulation = createRunEnvironment();

		
		simulation.refresh(options);

	}

	self.createSimulation(options);


}

module.exports = trash


