app.factory("evolve.service", ["utility", 'config.service', 'display.service', 'api.service', 'simulators', 'input.service', function (u, config, display, api, simulators, $input) {


	var self = this;


    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;


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


    var sendData = function (x) {

        react.push({
            name:"data" + self.name,
            state:x
        })
    }

    var getBest = function (complete) {


    	api.getBest(function (res) {
            
            sendData({evdata:res.data.ext});

	    	if (typeof complete === "function") complete();

	    })

    }

    var genA = 0;
    var genB = genA;
    var stepdata;

    var setStepdata = function () {


    	api.stepdata(function (res) {

    		stepdata = res.data.stepdata ? res.data.stepdata : $stepdata;

    		genA = stepdata.gen;

            $stepdata = {
            	gen:stepdata.gen,
            	org:stepdata.org,
            	run:stepdata.run,
            	step:stepdata.step
            }

            sendData({stepdata:$stepdata})

            if (genA != genB) {
            	genB = genA;
            }

            getBest();

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


        display.updateProgresBar(percent);

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


    var isEvolving = function () {

        return update;
    }


    var completeEvolve = function ($scope) {

    	running(false, $scope);

    	getBest(function () {

            running(false, $scope);
            $("#breakfeedback").hide();


            u.toggle("show", "settings", {fade:600});

            if (self.name == "feedback") {
                
                u.toggle("disable", "stop", {fade:600});
                u.toggle("enable", "play", {fade:600});
                u.toggle("enable", "refresh", {fade:600});

            }
            else {


                u.toggle("show", "hud", {fade:600});

                u.toggle("enable", "refresh", {fade:600});
                u.toggle("enable", "play", {fade:600});
                if (self.name == "trash") u.toggle("enable", "restart", {fade:600});
                if (self.name == "trash") u.toggle("enable", "step", {fade:600});
                
                simulator.setup(function () {

                    simulator.refresh(); 
                });

            }


            setTimeout(function () {
                $("#evolvedata").animate({color:"#000"}, 600);
            }, 300);

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

        $input.resetInput();

        var input = $input.getInput(false);

        if (input.session) {

            api.initialize(function (res) {

                initData();

                if (typeof complete === "function") complete({res:res});

            });
        }

    }


    var run = function ($scope) {

    	evolving(true, $scope);

		input = $input.getInput();


        u.toggle("hide", "settings", {fade:300});        


        if (self.name == "feedback") {


            u.toggle("enable", "stop", {fade:300});
            u.toggle("disable", "play", {fade:300});
            u.toggle("disable", "refresh", {fade:300});

    	}
    	else {


            display.forceEvolveHeight();

            
            
            u.toggle("hide", "run", {fade:300});
            u.toggle("disable", "refresh", {fade:300});
            u.toggle("disable", "restart", {fade:300});
            u.toggle("disable", "step", {fade:300});
            u.toggle("disable", "play", {fade:300});
            u.toggle("disable", "stop", {fade:300});


            u.toggle("show", "evolve", {fade:600, delay:600});
            u.toggle("show", "break", {delay:600});

    	}

        api.run(function (res) {

            runEvolveComplete($scope);
        })


        setTimeout(function () {
            $("#evolvepage").animate({color:"#fff"}, 600);
            $("#evolvepage").addClass("white-t");
        }, 300);


    }


    var breakRun = function ($scope) {


        running(false, $scope);
        $("#breakfeedback").show();

        u.toggle("hide", "evolving");

        $input.setInput({
            gens:$stepdata.gen
        });

        // uncomment this line to force the gens value to change in the settings panel to the current generation when hardstop was called
        // so that to continue evolving, the gens value must be increased to the previous or desired value

        // keeping this line commented out, the gens value (while it was changed on the backend to force the stop) 
        // does not change in the settings panel, so that continuing to evolve only requires hitting the evolve button again
        // with no other action
        
        // ## this line sets the gens value to the current generation
        // ## $input.getInput(false);
        // ##

        api.hardStop(function (res) {

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
        isEvolving:isEvolving,
		run:run,
		breakRun:breakRun,
		resetgen:resetgen,
        running:running,
        evolving:evolving
	}




}])