app.factory("evolve.service", ["utility", 'display.service', 'api.service', 'input.service', "config.service", function (u, display, api, $input, config) {


	var self = this;


    self.name = "";

    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;


    var _$scope = {};
    var interface_timer;
    var stepTimer;
    var updateTime;
    var spinning = true;
	var simulator;
	var update = false;
    var ev = false;
    var genA = 0;
    var genB = genA;
    var stepdata;
    var evolveCompleteCount = 1;

    var timeDivisor = {
        stepdata:2,
        ui_updater:10,
        isRunning:4
    }

    var $stepdata = {
        gen:0,
        org:0,
        run:0,
        step:0
    }

    var $evdata = {
        index:0,
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

    // spinning = false;

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

        var spinElem = "#"+self.name+"efspintoggle";

        g.waitForElem({elems:spinElem}, function (options) {
            ev = _evolve;
            if (_evolve) {
                if (spinning) $(options.elems).addClass("spinning");
                running(_evolve, _$scope);
            }
            else {
                if (spinning) $(options.elems).removeClass("spinning");
            }

        });
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

    var resetEvdata = function (data) {

        react.push({
            name:"evdata" + self.name,
            state:{
                evdata:data
            }
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
            index:0,
            best:{
                fitness:0
            },
            worst:{
                fitness:0
            }
        }


        sendData({
            stepdata:$stepdata
        });


        resetEvdata($evdata);

    }

    


    var getBest = function (complete) {


    	api.getBest(function (res) {
            
            sendData({
                evdata:{
                    index:0,
                    best:res.data.ext.best,
                    wost:res.data.ext.worst
                }
            });

	    	if (typeof complete === "function") complete();

	    })

    }


    var getEvdata = function (count) {

        api.getBest(function (res) {
            
            sendData({
                evdata:{
                    index:$stepdata.gen,
                    best:res.data.ext.best,
                    worst:res.data.ext.worst
                }
            });

            if (typeof complete === "function") complete();

        })
    }

    // getEvdata();

    var setStepdata = function () {

        // console.log("update time", updateTime);

    	api.stepdata(function (res) {

            getBest();

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

       		}, updateTime/timeDivisor.stepdata);


	    })

    }


    var stepprogress = function (name) {
        
        var input = $input.getInput(false);

        var genT = input.gens || 1;
        var orgT = input.pop || 1;
        var runT = input.runs || 1;
        var stepT = input.programInput.totalSteps || 1;


        // var gen = $stepdata.gen - 1 || 0;
        // var org = $stepdata.org - 1 || 0;
        // var step = $stepdata.step || 0;
        // var run = $stepdata.run - 1 || 0;

        var gen = $stepdata.gen || 0;
        var org = $stepdata.org || 0;
        var step = $stepdata.step || 0;
        var run = $stepdata.run || 0;


        var stepP = (step + run*stepT + org*(runT*stepT) + gen*(orgT*runT*stepT))/(stepT*runT*orgT*genT);
        var runP = (run + org*runT)/runT;
        var orgP = (org + gen*orgT)/orgT;

        var percent = stepP;

        if (percent >= 1) {
            percent = 1;
        }

        display.updateProgressBar(name, percent, gen, genT);
    }


    var ui_updater = function ($scope) {

        _$scope = $scope;

        interface_timer = setInterval(function () {

            if (update) {
                if (ev) {
                    stepprogress(self.name);
                }
                _$scope.$apply();
            }

        }, updateTime/timeDivisor.ui_update);

    }


    var isEvolving = function () {

        return update;
    }


    var refreshSimulator = function (clear) {

        console.log("refreshsimulator", clear, simulator);

        simulator.setup(clear, function () {

            console.log("refresh simulator");
            simulator.refresh(); 
        });
    }


    var completeEvolve = function ($scope) {

        _$scope = $scope

    	running(false, _$scope);

        console.log("complete evolve");


        events.dispatch("evolve." + self.name + ".end");


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

            // refreshSimulator();
        }
        else {

            u.toggle("show", "run", {fade:params.fade});

            if (self.name == "trash")  {

                u.toggle("enable", "restart", {delay:params.delay, fade:params.fade});
                u.toggle("enable", "step", {delay:params.delay, fade:params.fade});
            }

            refreshSimulator(false);
        }


        getBest();

        getEvdata(evolveCompleteCount++);

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

            }, updateTime/timeDivisor.isRunning)

	    })

    }




    var runEvolveComplete = function ($scope) {

        _$scope = $scope

		isRunning(_$scope);

		setStepdata();

    }



    var resetgen = function (refresh, complete) {

        $input.resetInput();

        var input = $input.getInput(false);

        events.dispatch("evolve."+self.name+".reset");

        if (refresh) refreshSimulator(true);

        if (self.name == "feedback") {
            u.toggle("enable", "play", {delay:params.delay, fade:params.fade});
        }
        else {
            u.toggle("disable", "restart", {delay:params.delay, fade:params.fade});
            u.toggle("disable", "step", {delay:params.delay, fade:params.fade});
            u.toggle("disable", "play", {delay:params.delay, fade:params.fade});
            u.toggle("disable", "stop", {delay:params.delay, fade:params.fade});

        }

        if (input.session) {


            console.log("reset gen initialize");
            api.instantiate(function ($res) {

                api.initialize(function (res) {

                    initData();

                    if (typeof complete === "function") complete({res:res});

                });

            })
        }

    }


    var run = function ($scope) {

        _$scope = $scope;

    	evolving(true, _$scope);

		// input = $input.getInput();

        console.log("run evolve");

        events.dispatch("evolve."+ self.name +".start");

        u.toggle("hide", "settings", {fade:params.fade});        
        // u.toggle("hide", "run");

        if (self.name == "feedback") {


            u.toggle("enable", "stop", {fade:params.fade});
            u.toggle("disable", "play", {fade:params.fade});
            u.toggle("disable", "refresh", {fade:params.fade});
            u.toggle("hide", "evolve");
    	}
    	else {


            // display.();

            
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


        if (self.name == "feedback") {
            
            api.run(function (res) {

                runEvolveComplete(_$scope);
            })
        }
        else {

            simulator.refresh(function () {

                api.run(function (res) {

                    runEvolveComplete(_$scope);
                })

            });
        }
        
             

    }


    var breakRun = function ($scope) {


        console.log("hard stop");

        _$scope = $scope;

        running(false, _$scope);
        
        u.toggle("show", "breakfeedback");

        events.dispatch("evolve."+self.name+".end");

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

        // simulator = assets.get(assets.types.SIMULATOR, self.name);


        react.subscribe({
            name:"scope" + self.name,
            callback:function(x) {

                _$scope = x;
            }
        })


        react.subscribe({
            name:"simulator" + self.name,
            callback:function (x) {

                simulator = x;
            }
        })



        config.get("global.programs." + self.name)
        .then(function (data) {

            updateTime = data.updateTime;

            resetgen();

            initData();
        })


    }



	return {
		setup:setup,
		running:running,
		evolving:evolving,
        isEvolving:isEvolving,
		run:run,
		breakRun:breakRun,
		resetgen:resetgen,
        stepprogress:stepprogress
	}




}])