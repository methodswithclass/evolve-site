
var robotFact = require("./robot.js");
var environmentFact = require("./environment.js");
var d = require("../../data/programs/trash.js");
var g = require("mc-shared").utility_service;



var trash = function (options) {

	var self = this;


	var actions = d.data.actions;
	var runs;
	var run = 0;
	var $stepdata;

	var running = false;
	var fits = [];
	var avgfit = 0;
	var after;
	var success;
	var fitness = 0;
	var step = 0;
	var target = 0;

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

	var performStep = function ($step, $run, fit, params, complete) {

		//console.log("step", step);

		if ($step < options.totalSteps) {

			after = robot.update();

			$stepdata = {
				name:"step." + input.name,
				gen:params.gen,
				org:params.index,
				run:$run,
				step:$step
			}

			fit += getPoints(after);

			performStep($step + 1, $run, fit, params, complete);

		}
		else {
			complete(fit);
		}
	}

	var performRun = function ($run, fits, params, complete) {

		//console.log("run", run);

		if ($run < runs) {

			fit = 0;
			avgfit = 0;
			running = true;

			self.instruct(params.dna);

			if (params.input.newenv) {

				target = environment.refresh(params.input.programInput);
			}

			performStep(0, $run, 0, params,
				function (x) {

					fits.push({fitness:x, target:target});

					performRun($run + 1, fits, params, complete);
				}
			);

		}
		else {		
			complete(fits);
		}
	}

	// self.run = function (params, complete) {

	// 	var self = this;

	// 	input = params.input;

	// 	runs = input.runs;

	// 	var fits = [];
	// 	var avgfit;

		// performRun(0, fits, params,
		// 	function (fits, x) {

		// 		//console.log("fits", ...fits, "fit", x);

		// 		fits[fits.length] = x;

		// 		return fits;
		// 	},
		// 	function (fits) {

		// 		avgfit = g.truncate(g.average(fits, function (value, index, array) {return value.fit;}),2)


		// 		var count = 0;
		// 		for (i in fits) {
		// 			if (fits[i].fit >= fits[i].target*actions.list[5].points.success) {
		// 				count++;
		// 			}
		// 		}

		// 		var success = count > fits.length*0.8;

		// 		complete({
		// 			runs:fits,
		// 			avg:avgfit,
		// 			success:success
		// 		});

		// 	}
		// );
		
	// }



	self.run = function (params, complete) {


		var self = this;

		input = params.input;
		runs = input.runs;

		run = 0;

		fits.length = 0;
		fits = null;
		fits = [];

		self.instruct(params.dna);


		recursion = true;


		if (recursion) {

			performRun(0, fits, params,
				function (fits) {

					avgfit = g.truncate(
					                    g.average(
					                              fits, 
					                              function (value, index, array) {
					                              	return value.fitness;
					                              })
					                    , 2
					                    );


					var count = 0;
					for (i in fits) {
						if (fits[i].fitness >= fits[i].target*actions.list[5].points.success) {
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
		else {



			do {

				step = 0;
				fitness = 0;
				avgfit = 0;

				if (params.input.newenv) {

					target = environment.refresh(params.input.programInput);
				}

				do {

					after = robot.update();

					$stepdata = {
						name:"step." + input.name,
						gen:params.gen,
						org:params.index,
						run:run,
						step:step
					}

					fitness += getPoints(after);

					step++;

					// console.log("\n\nstep", step, "out of total steps", options.totalSteps, "fitness", fitness, "\n\n");

				} while (step < options.totalSteps);


				fits.push({fitness:fitness, target:target})


				run++;

				// console.log("\n\n\nrun", run, "out of runs", runs, "total fitness", fitness, "\n\n\n");

			} while (run < runs);


			avgfit = g.truncate(g.average(fits, function (value, index, array) {return value.fitness;}),2)


			count = 0;
			for (i in fits) {
				if (fits[i].fitness >= fits[i].target*actions.list[5].points.success) {
					count++;
				}
			}

			success = count > fits.length*0.8;

			complete({
				runs:fits,
				avg:avgfit,
				success:success
			});

		}


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


