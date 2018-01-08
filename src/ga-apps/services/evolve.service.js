app.factory("evolve.service", ["utility", "events.service", "global.service", 'react.service', 'config.service', 'display.service', 'api.service', 'simulators', 'input.service', function (u, events, g, react, config, display, api, simulators, $input) {


	var self = this;


	var simulator;
	var update = false;
    var ev = false;

    var $stepdata;


    var initData = function () {

        $stepdata = {
            gen:0,
            org:0,
            run:0,
            step:0
        }

    }

    var interface_timer;


    var toggleTimer = function ($toggle, $scope) {

        if ($toggle) {

            ui_updater($scope);
        }
        else {

            if (interface_timer) {
                clearInterval(interface_timer)
                interface_timer = null;
            }
        }
    }
	
	var evolving = function (_evolve, $scope) {
        ev = _evolve;
        if (_evolve) running(_evolve, $scope);
    }
    
    var running = function (_run, $scope) {
        update = _run;
        toggleTimer(_run, $scope);
        if (!_run) evolving(_run, $scope);
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


    	api.getBest(function (res) {

	    	sendEvdata(res.data.ext);

	    	if (typeof complete === "function") complete();

	    })

    }

    var genA = 0;
    var genB = genA;
    var stepdata;

    var setStepdata = function () {


    	api.stepdata(function (res) {

	    	// console.log("get stepdata", res.data.stepdata);

    		stepdata = res.data.stepdata ? res.data.stepdata : $stepdata;

    		genA = stepdata.gen;

    		// console.log("stepdata", res.data.stepdata, stepdata);

            $stepdata = {
            	gen:stepdata.gen,
            	org:stepdata.org,
            	run:stepdata.run,
            	step:stepdata.step
            }

            sendStepdata($stepdata);

            if (genA != genB) {
            	genB = genA;
            	getBest();
            }

            setTimeout(function () {

            	if (update) setStepdata();
       		}, 0);

	    })

    }


    var stepprogress = function () {
        

        var genT = input.gens;
        var orgT = input.pop;
        var runT = input.runs;
        var stepT = input.programInput.totalSteps;

        var gen = $stepdata.gen - 1;
        var org = $stepdata.org - 1;
        var step = $stepdata.step || 0;
        var run = $stepdata.run - 1;

        // console.log("percent", gen, org, step, run);

        var stepP = (step + run*stepT + org*(runT*stepT) + gen*(orgT*runT*stepT))/(stepT*runT*orgT*genT);
        var runP = (run + org*runT)/runT;
        var orgP = (org + gen*orgT)/orgT;
        //var genP = gen/genT;

        var percent = stepP;

        if (percent >= 1) {
            percent = 1;
        }

        $("#rundata").css({width:percent*100 + "%"});

    }


    var ui_updater = function ($scope) {

        interface_timer = setInterval(function () {

            if (update) {
                if (ev) {
                    stepprogress();
                }
                $scope.$apply();
            }

        }, 30);

    }




    var completeEvolve = function ($scope) {

    	console.log("complete evolve");
    	console.log("evolving", update);

    	running(false, $scope);

    	getBest(function () {

    		u.toggle("hide", "evolve", {
	        	fade:600, 
	        	delay:2000,
	        	complete:function () {

	        		running(false, $scope);
		        	$("#breakfeedback").hide();


		        	if (self.name != "feedback") {
			        	
			        	u.toggle("show", "hud", {fade:600});

				        u.toggle("enable", "refresh", {fade:600});
				        u.toggle("enable", "play", {fade:600});
				        if (self.name == "trash") u.toggle("enable", "restart", {fade:600});
				        if (self.name == "trash") u.toggle("enable", "step", {fade:600});
			        	

				        u.toggle("show", "run", {fade:600});
				        u.toggle("show", "settings", {fade:600});


			        	simulator.setup(function () {

				    		simulator.refresh(); 
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



    var isRunning = function ($scope) {

    	api.isRunning(function (res) {

	    	running(res.data.running, $scope);

			setTimeout(function () {
        	
            	if (update) {
            		isRunning($scope);
            	}
            	else {
		    		completeEvolve($scope);
		    	}

            }, 500)

	    })

    }




    var runEvolveComplete = function ($scope) {

		isRunning($scope);

		setStepdata();

		simulator.reset();
		simulator.refresh();
    }



    var resetgen = function (complete) {

    	console.log("reset gen");

        $input.resetInput();

        var input = $input.getInput(false);

        if (input.session) {

            api.initialize(function () {

                initData();

                if (typeof complete === "function") complete();

            });
        }

    }


    var run = function ($scope) {

    	evolving(true, $scope);


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


        			api.run(function (res) {

				    	console.log("Run algorithm success", res);

				    	runEvolveComplete($scope);
				    })
	                
	            }
	        });

    	}
    	else {


    		u.toggle("enable", "stop", {fade:300});
	        u.toggle("disable", "play", {fade:300});
	        u.toggle("disable", "refresh", {fade:300});


    		api.run(function (res) {

		    	console.log("Run algorithm success", res);

		    	runEvolveComplete($scope);
		    })

    	}

        setTimeout(function () {
            $("#evolvepage").animate({color:"#fff"}, 600);
            $("#evolvepage").addClass("white-t");
        }, 300);


    }


    var breakRun = function ($scope) {


        running(false, $scope);
        $("#breakfeedback").show();

        console.log("set input hard stop");

        $input.setInput({
            gens:$stepdata.gen
        });

        api.hardStop(function (res) {

            console.log("Hard stop algorithm success", res);

            completeEvolve($scope);
        })
    }


    var setup = function (name) {

        self.name = name;

        simulator = simulators.get(self.name);

        resetgen();

        initData();

    }



	return {
		setup:setup,
		running:running,
		evolving:evolving,
		run:run,
		breakRun:breakRun,
		resetgen:resetgen,
        running:running,
        evolving:evolving
	}




}])