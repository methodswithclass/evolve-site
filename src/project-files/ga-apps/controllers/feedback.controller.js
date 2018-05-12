app.factory("feedback.controller", ["feedback-sim", "utility", 'config.service', 'evolve.service', 'input.service', 'display.service', function (simulator, u, config, evolve, $input, display) {


	var pageBuilt;


    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;


	var setup = function (self, $scope) {

		pageBuilt = display.beenBuilt(self.name);

	}


	var createEnvironment = function (self, $scope) {

		simulator.create();
        simulator.reset();
	}


	var finish = function (self, $scope) {


	}

	var build = function (self, $scope) {

		console.log("build controller", self.name);

        processTypes = config.get("types.processTypes")

        $scope.programInput = config.get("global.feedback");

        react.subscribe({
            name:"data" + "feedback",
            callback:function (x) {

                step({}, {}, x.evdata ? (x.evdata.best ? x.evdata.best.dna : []) : []);                
            }

        });


        react.subscribe({
            name:"sim." + self.name,
            callback:function (x) {
                self.sdata = x;
            }
        });
	}

	var enter = function (self, $scope) {

		console.log("enter controller", self.name);


        if (!pageBuilt) {

            $input.createInput(self.name);
        }
        else {

            $input.setName(self.name);
        }

        evolve.setup(self.name);

        $input.masterReset();

        $input.setInput({
            name:self.name,
            programInput:$scope.programInput
        })

        $scope.settings = $input.setSettings($scope, $input.getInput(false));
	}


	var refresh = function (self, $scope) {

        evolve.running(false, $scope);
        simulator.refresh();
        evolve.resetgen();
    }

    var restart = function (self, $scope) {

        
        // $scope.running(false);
        // simulator.reset();
    }

    var step = function (self, $scope, dna) {

        setTimeout(() => {

            var duration = $input.resendInput().programInput.duration;

            simulator.step(dna, duration);

        }, $input.resendInput().programInput.evdelay);
    }

    var run = function (self, $scope) {
        
        evolve.run($scope);
    }

    var stop = function (self, $scope) {

        evolve.breakRun($scope); 
    }

	return {
		setup:setup,
		createEnvironment:createEnvironment,
		finish:finish,
		build:build,
		enter:enter,
		refresh:refresh,
		restart:restart,
		step:step,
		run:run,
		stop:stop

	}


}]);