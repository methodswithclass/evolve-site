
var robotFact = require("../robot.js");
var environmentFact = require("../environment.js");
var d = require("../../../data/programs/trash.js");
var g = require("@methodswithclass/shared").utility_service;
// var g = require("../../../../../src/assets/js/shared.js").utility_service;
// var Worker = require("webworker-threads").Worker;


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

	self.envs = [];
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

		var $environment = function ($options) {

			var self = this;

			self.robot = new robotFact();
			self.environment = new environmentFact();
			

			self.setup = function($$options) {

				self.robot.setup(self.environment, $$options ? $$options : $options);
			}

			self.reset = function () {

				// console.log("\nreset environment")
				
				self.robot.reset();

				self.environment.reset();

				return self.get();
			}


			self.refresh = function ($$options) {

				// console.log("\n\nrefresh environment");


				self.environment.refresh($$options ? $$options : $options);

				self.setup($$options ? $$options : $options);

				return self.get();
				
			}

			self.get = function () {

				return self.environment.get();
			}


			self.instruct = function (genome) {

				self.robot.instruct(genome);
				// self.robot.reset();
			}


			self.update = function() {

				var after = self.robot.update();

				var points = getPoints(after);

				return {
					after:after,
					points:points
				}

			}
		}

		return new $environment(options);


	}


	var refreshEnvironments = function (input) {

		self.envs.forEach((p, index) => {

			p.refresh(input.programInput);
		});
	}


	var makeEnvironments = function ($runs, input) {

		var envIndex = 0;
		self.envs = [];

		if ($runs.hasOwnProperty("runs")) {
			runs = $runs.runs;
		}
		else {
			runs = $runs;
		}

		while (envIndex < runs) {

			self.envs[envIndex] = createRunEnvironment();

			envIndex++;
		}

		refreshEnvironments(input);

	}

	

	self.getEnv = function (index) {

		return self.envs[index];
	}

	self.get = function (index) {

		return self.envs[index].get();
	}


	self.gene = function () {
		// console.log("get gene");
		return Math.floor(Math.random()*(actions.list.length-1));
	}

	self.hardStop = function () {

		runs = 0;
	}

	self.stepdata = function () {

		return $stepdata;
	}

	var performStep = function ($step, $run, fit, fits, params, env, complete) {

		//console.log("step", step);

		var result;

		if ($step < options.totalSteps) {

			// console.log("indi", params.index, "$run", $run, "step", $step);


			result = env.update();


			$stepdata = {
				name:"step." + input.name,
				gen:params.gen,
				org:params.index,
				run:$run,
				step:$step
			}

			performStep($step + 1, $run, fit + getPoints(result.after), fits, params, env, complete);

		}
		else {
			return complete(fits, fit);
		}
	}

	var performRun = function ($run, fits, params, complete) {

		if ($run < runs) {

			// console.log("indi", params.index, "run", $run);

			fit = 0;
			avgfit = 0;
			running = true;


			// self.getEnv($run).setup(params.input.programInput);

			self.getEnv($run).instruct(params.dna);


			performStep(0, $run, 0, fits, params, self.getEnv($run),
				function (fits, x) {

					fits.push({fitness:x});

					performRun($run + 1, fits, params, complete);

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

		// console.log("run size", input.programInput.grid.size);

		run = 0;

		fits.length = 0;
		fits = null;
		fits = [];

		// console.log("run gen", params.gen);

		if (params.gen == 1) {
			// console.log("make environments");
			makeEnvironments(runs, input);
		}
		else {
			// if (params.index == 1) console.log("refresh environments");
			refreshEnvironments(input);
		}

		// console.log("after");

		performRun(0, fits, params,
			function (fits) {

				// console.log(fits);

				avgfit = g.avgArray({
					array:fits,
					value:"fitness",
					truncate:2
				});


				// var count = 0;
				// for (var i in fits) {
				// 	if (fits[i].fitness >= fits[i].target*actions.list[5].points.success) {
				// 		count++;
				// 	}
				// }

				// console.log("run complete", avgfit);

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

	self.reset = function ($options) {

		simulation.reset($options);

		return simulation.get();
	}

	self.refresh = function ($options) {

		// console.log("refresh environment");

		simulation.refresh($options);
		self.reset($options);

		return simulation.get();
	}

	self.instruct = function (genome) {
		
		// console.log("instruct robot");

		simulation.instruct(genome);
	}

	self.simulate = function () {

		// console.log("simulate result", result);

		return simulation.update();
	}

	self.createSimulation = function ($options) {


		simulation = createRunEnvironment();

		
		simulation.refresh($options);

	}

	self.createSimulation(options);


}

module.exports = trash


