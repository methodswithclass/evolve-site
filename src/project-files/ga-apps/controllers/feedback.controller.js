app.factory("feedback.controller", ["feedback-sim", "utility", "events.service", "global.service", 'react.service', 'config.service', 'evolve.service', 'input.service', 'display.service', function (simulator, u, events, g, react, config, evolve, $input, display) {


	var pageBuilt;


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

        react.subscribe({
            name:"ev.feedback",
            callback:function (x) {

                step({}, {}, x.best.dna);
            }

        });


        processTypes = config.get("types.processTypes")

        $scope.programInput = config.get("global.feedback");


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
        $scope.resetgen();
    }

    var restart = function (self, $scope) {

        
        // $scope.running(false);
        // simulator.reset();
    }

    var step = function (self, $scope, dna) {

        simulator.step(dna, 200);
    }

    var play = function (self, $scope) {
        
        $scope.run();
    }

    var stop = function (self, $scope) {

        $scope.breakRun(); 
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
		play:play,
		stop:stop

	}


}]);