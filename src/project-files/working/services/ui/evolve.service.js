app.factory("evolve.service", ["utility", 'display.service', 'api.service', 'simulators', 'input.service', function (u, display, api, simulators, $input) {


	var self = this;


    self.name = "";

    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;


    var _$scope = {};
    var interface_timer;
	var simulator;
	var update = false;
    var ev = false;
    var genA = 0;
    var genB = genA;
    var stepdata;

    var $stepdata = {
        gen:0,
        org:0,
        run:0,
        step:0
    }

    var $evdata = {
        best:{
            fitness:0
        },
        worst:{
            fitness:0
        }
    }

    var params = {
        delay:0,
        fade:200
    }


    var toggleTimer = function ($toggle, $scope) {

        _$scope = $scope;

        if ($toggle) {

            ui_updater(_$scope);
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
        if (_evolve) running(_evolve, _$scope);
    }
    
    var running = function (_run, $scope) {
        _$scope = $scope;
        update = _run;
        toggleTimer(_run, _$scope);
        if (!_run) evolving(_run, _$scope);
    }


    var sendData = function (x) {

        react.push({
            name:"data" + self.name,
            state:x
        })
    }

    var initData = function () {

        $stepdata = {
            gen:0,
            org:0,
            run:0,
            step:0
        }

        $evdata = {
            best:{
                fitness:0
            },
            worst:{
                fitness:0
            }
        }


        sendData({
            stepdata:$stepdata,
            evdata:$evdata
        });

    }


    var getBest = function (complete) {


    	api.getBest(function (res) {
            
            sendData({
                evdata:res.data.ext
            });

	    	if (typeof complete === "function") complete();

	    })

    }

    var setStepdata = function () {

        getBest();

    	api.stepdata(function (res) {

    		stepdata = res.data.stepdata ? res.data.stepdata : $stepdata;

    		genA = stepdata.gen;

            $stepdata = {
            	gen:stepdata.gen,
            	org:stepdata.org,
            	run:stepdata.run,
            	step:stepdata.step
            }

            // console.log("stetpdata", $stepdata);

            sendData({
                stepdata:$stepdata
            });

            if (genA != genB) {
            	genB = genA;
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


        var stepP = (step + run*stepT + org*(runT*stepT) + gen*(orgT*runT*stepT))/(stepT*runT*orgT*genT);
        var runP = (run + org*runT)/runT;
        var orgP = (org + gen*orgT)/orgT;

        var percent = stepP;

        if (percent >= 1) {
            percent = 1;
        }

        display.updateProgressBar(percent);
    }


    var ui_updater = function ($scope) {

        _$scope = $scope;

        interface_timer = setInterval(function () {

            if (update) {
                if (ev) {
                    stepprogress();
                }
                _$scope.$apply();
            }

        }, 30);

    }


    var isEvolving = function () {

        return update;
    }


    var refreshSimulator = function (clear) {

        simulator.setup(clear, function () {

            simulator.refresh(); 
        });
    }


    var completeEvolve = function ($scope) {

        _$scope = $scope

    	running(false, _$scope);

        console.log("complete evolve");

        u.toggle("show", "settings", {delay:params.delay, fade:params.fade});
        u.toggle("show", "nav", {delay:params.delay, fade:params.fade});
        u.toggle("hide", "breakfeedback", {delay:params.delay});
        u.toggle("hide", "evolve", {delay:params.delay, fade:params.fade*2});
        
        u.toggle("enable", "refresh", {delay:params.delay, fade:params.fade});
        u.toggle("enable", "play", {delay:params.delay, fade:params.fade});

        if (self.name == "feedback") {
            
            u.toggle("disable", "stop", {delay:params.delay, fade:params.fade});
            u.toggle("enable", "play", {delay:params.delay, fade:params.fade});
            u.toggle("enable", "refresh", {delay:params.delay, fade:params.fade});
        }
        else {

            u.toggle("show", "run", {delay:params.delay, fade:params.fade});

            if (self.name == "trash")  {

                u.toggle("enable", "restart", {delay:params.delay, fade:params.fade});
                u.toggle("enable", "step", {delay:params.delay, fade:params.fade});
            }

            refreshSimulator(false);
        }


        getBest();

    }



    var isRunning = function ($scope) {

        _$scope = $scope;

    	api.isRunning(function (res) {

	    	running(res.data.running, _$scope);

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

        _$scope = $scope

		isRunning(_$scope);

		setStepdata();

		simulator.reset();
		simulator.refresh();
    }



    var resetgen = function (complete) {

        $input.resetInput();

        var input = $input.getInput(false);


        refreshSimulator(true);

        u.toggle("disable", "restart", {delay:params.delay, fade:params.fade});
        u.toggle("disable", "step", {delay:params.delay, fade:params.fade});
        u.toggle("disable", "play", {delay:params.delay, fade:params.fade});
        u.toggle("disable", "stop", {delay:params.delay, fade:params.fade});

        if (input.session) {

            api.initialize(function (res) {

                initData();

                if (typeof complete === "function") complete({res:res});

            });
        }

    }


    var run = function ($scope) {

        _$scope = $scope;

    	evolving(true, _$scope);

		input = $input.getInput();

        console.log("run evolve");


        u.toggle("hide", "settings", {fade:params.fade});        


        if (self.name == "feedback") {


            u.toggle("enable", "stop", {fade:params.fade});
            u.toggle("disable", "play", {fade:params.fade});
            u.toggle("disable", "refresh", {fade:params.fade});

    	}
    	else {


            display.forceEvolveHeight();

            
            u.toggle("hide", "nav", {fade:params.fade});
            u.toggle("hide", "run", {fade:params.fade});
            u.toggle("disable", "refresh", {fade:params.fade});
            u.toggle("disable", "restart", {fade:params.fade});
            u.toggle("disable", "step", {fade:params.fade});
            u.toggle("disable", "play", {fade:params.fade});
            u.toggle("disable", "stop", {fade:params.fade});


            u.toggle("show", "evolve", {fade:params.fade});
            u.toggle("show", "break", {delay:params.delay});

    	}

        api.run(function (res) {

            runEvolveComplete(_$scope);
        })

    }


    var breakRun = function ($scope) {


        _$scope = $scope;

        running(false, _$scope);
        
        u.toggle("show", "breakfeedback");


        // uncomment this line to force the gens value to change in the settings panel to the current generation when hardstop was called
        // so that to continue evolving, the gens value must be increased to the previous or desired value

        // keeping this line commented out, the gens value (while it was changed on the backend to force the stop) 
        // does not change in the settings panel, so that continuing to evolve only requires hitting the evolve button again
        // with no other action
        
        // ## this line sets the gens value to the current generation
        // ## $input.getInput(false);
        // ##

        api.hardStop();
    }


    var setup = function (name) {

        self.name = name;

        simulator = simulators.get(self.name);

        resetgen();

        react.subscribe({
            name:"scope" + self.name,
            callback:function(x) {

                _$scope = x;
            }
        })

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