app.factory("evolve.service", ["utility", "events.service", "global.service", 'react.service', 'config.service', 'display.service', 'api.service', 'simulators', 'input.service', function (u, events, g, react, config, display, api, simulators, $input) {


	var self = this;


	var simulator;
	var update = false;
    var ev = false;

    var stepdata;


	var setup = function (name) {

		self.name = name;

		simulator = simulators.get(self.name);

	}


	
	var evolving = function (_evolve) {
        ev = _evolve;
        if (_evolve) running(_evolve);
    }
    
    var running = function (_run) {
        update = _run;
        if (!_run) evolving(_run);
    }



    var sendEvdata = function (x) {

       	react.push({
       		name:"ev." + self.name,
       		state:x
       	});
    }

    var sendStepdata = function (x) {

    	react.push({
       		name:"step." + self.name,
       		state:x
       	});
    }

    var getBest = function (complete) {


    	api.getBest($scope, function (res) {

	    	sendEvdata(res.data.ext);

	    	if (complete) complete();

	    })

    }

    var genA = 0;
    var genB = genA;

    var setStepdata = function () {


    	api.stepdata($scope, function (res) {

	    	// console.log("get stepdata", res.data.stepdata);

    		var stepdata = res.data.stepdata ? res.data.stepdata : $scope.stepdata;

    		genA = stepdata.gen;

    		// console.log("stepdata", res.data.stepdata, stepdata);

            stepdata = {
            	gen:stepdata.gen,
            	org:stepdata.org,
            	run:stepdata.run,
            	step:stepdata.step
            }

            sendStepdata(stepdata);

            if (genA != genB) {
            	genB = genA;
            	getBest();
            }

            setTimeout(function () {

            	if (update) setStepdata();
       		}, 0);

	    })

    }




    var completeEvolve = function (simulate) {

    	console.log("complete evolve");
    	console.log("evolving", update);

    	running(false);

    	getBest(function () {

    		u.toggle("hide", "evolve", {
	        	fade:600, 
	        	delay:2000,
	        	complete:function () {

	        		running(false);
		        	$("#breakfeedback").hide();


		        	if (self.name != "feedback") {
			        	
			        	u.toggle("show", "hud", {fade:600});

				        u.toggle("enable", "refresh", {fade:600});
				        u.toggle("enable", "play", {fade:600});
				        if (self.name == "trash") u.toggle("enable", "restart", {fade:600});
				        if (self.name == "trash") u.toggle("enable", "step", {fade:600});
			        	

				        u.toggle("show", "run", {fade:600});
				        u.toggle("show", "settings", {fade:600});


			        	simulator.setup($scope.session, function () {

				    		simulator.refresh($scope.session); 
				    	});

		        	}
		        	else {

		        		u.toggle("disable", "stop", {fade:600});
				        u.toggle("enable", "play", {fade:600});
				        u.toggle("enable", "refresh", {fade:600});
		        	}

			    	setTimeout(function () {
			            $("#evolvedata").animate({color:"#000"}, 600);
			        }, 300);


			    }
			});

    	});


    }



    var isRunning = function () {

    	api.isRunning($scope, function (res) {

	    	running(res.data.running);

			setTimeout(function () {
        	
            	if (update) {
            		isRunning();
            	}
            	else {
		    		completeEvolve();
		    	}

            }, 500)

	    })

    }




    var runEvolveComplete = function () {

		isRunning();

		setStepdata();

		simulator.reset($scope.session);
		simulator.refresh($scope.session);
    }



    var resetgen = function ($scope, complete) {

    	console.log("reset gen");

        $input.resetInput();
        
        $scope.animateRefresh(function () {

            api.initialize($scope, function (res) {

		    	if (complete) complete();
		    	
		    })

        });
    }


    var run = function ($scope) {

    	evolving(true);


		console.log("step progress get input")

		input = $input.getInput();


        display.forceEvolveHeight();


        // $("#programInputCover").removeClass("none").addClass("block");

        if (self.name != "feedback") {

	        u.toggle("hide", "settings", {fade:300});
	        u.toggle("hide", "run", {fade:300});
	        u.toggle("disable", "refresh", {fade:300});
	        u.toggle("disable", "restart", {fade:300});
	        u.toggle("disable", "step", {fade:300});
	        u.toggle("disable", "play", {fade:300});
	        u.toggle("disable", "stop", {fade:300});


	        u.toggle("show", "evolve", {
	            fade:600,
	            delay:600,
	            complete:function () {


        			api.run($scope, function (res) {

				    	console.log("Run algorithm success", res);

				    	runEvolveComplete();
				    })
	                
	            }
	        });

    	}
    	else {


    		u.toggle("enable", "stop", {fade:300});
	        u.toggle("disable", "play", {fade:300});
	        u.toggle("disable", "refresh", {fade:300});


    		api.run($scope, function (res) {

		    	console.log("Run algorithm success", res);

		    	runEvolveComplete();
		    })

    	}

        setTimeout(function () {
            $("#evolvepage").animate({color:"#fff"}, 600);
            $("#evolvepage").addClass("white-t");
        }, 300);


    }



	return {
		setup:setup,
		running:running,
		evolving:evolving,
		run:run,
		breakRun:breakRun,
		resetgen:resetgen
	}




}])