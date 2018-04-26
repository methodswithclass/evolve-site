app.factory("trash.controller", ["trash-sim", "utility", 'api.service', 'config.service', 'evolve.service', 'input.service', 'display.service', function (simulator, u, api, config, evolve, $input, display) {


	var pageBuilt;


    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;


	var setup = function (self, $scope) {

		pageBuilt = display.beenBuilt(self.name);


		self.outcome = function (outcome) {

	        if ((self.sdata && self.sdata.move.action.id == 4) || outcome !== "success") {

	            return "/assets/img/ex.png";
	        }
	        else {
	            return "/assets/img/check.png";
	        }

	    }


	    self.programInputChange = function () {


	        self.programInput.update();

	        $input.setInput({
	            programInput:self.programInput
	        })


	        setTimeout(function () {

	            simulator.refresh();

	        }, 1000);

	    }

	}

	var finish = function (self, $scope) {

		self.programInputChange();
	}

	var createEnvironment = function (self, $scope) {

  		events.dispatch("refreshenv");
	}


	var build = function (self, $scope) {


        $scope.grids = [
        {
            size:3
        },
        {
            size:4
        },
        {
            size:5
        },
        {
            size:6
        },
        {
            size:7
        },
        {
            size:8
        },
        {
            size:9
        },
        {
            size:10
        },
        {
            size:11
        },
        {
            size:12
        },
        {
            size:13
        },
        {
            size:14
        },
        {
            size:15
        }
        ]


        processTypes = config.get("types.processTypes")

        self.programInput = config.get("global.trash");
        
        self.programInput.getTotalSteps = function () {

            return self.programInput.grid.size*self.programInput.grid.size*2;
        }

        self.programInput.convertTrash = function (percentToRate) {

            return percentToRate ? self.programInput.trashPercent/100 : self.programInput.trashRate*100;
        }

        self.programInput.validate = function () {


            self.programInput.trashPercent =   (self.programInput.trashPercent == "" ) ?  ""
                                           : (self.programInput.trashPercent > 90 ? 90 : self.programInput.trashPercent)
            self.programInput.trashRate =  (self.programInput.trashRate == "") ?  ""
                                           : (self.programInput.trashRate > 0.9 ? 0.9 : self.programInput.trashRate);


            self.programInput.trashPercent = (self.programInput.trashPercent == "") ?  "" 
                                            : (self.programInput.trashPercent < 1 ? 1 : self.programInput.trashPercent)
            self.programInput.trashRate = (self.programInput.trashRate == "" ) ? "" 
                                           :(self.programInput.trashRate < 0.01 ? 0.01 : self.programInput.trashRate)


            var _temp = {
                grid:self.programInput.grid.size,
                percent:self.programInput.trashPercent,
                rate:self.programInput.trashRate
            }

            self.programInput.grid.size = self.programInput.grid.size >= 3 && self.programInput.grid.size <= 15 ? parseInt(self.programInput.grid.size) : 5;


            if (_temp.grid != self.programInput.grid.size || _temp.percent != self.programInput.trashPercent || _temp.rate != self.programInput.trashRate) {

                self.programInput.update();
            }

        }


        self.programInput.update = function () {


            self.programInput.trashRate = self.programInput.convertTrash(true);
            self.programInput.totalSteps = self.programInput.getTotalSteps();

            self.programInput.validate();
        }

        self.programInput.checkInput = function (input1, input2) {

            var result = true;

            result = input1,programInput.grid.size == input2.programInput.grid.size;
            
            if (!result) return result;
            
            result = input1.programInput.trashRate == input2.programInput.trashRate;
            
            if (!result) return result;
            
            result = input1.programInput.totalSteps == input2.programInput.totalSteps;
            
            if (!result) return result;
            
            result = input1.programInput.processType == input2.programInput.processType;

            return result;

        }



        self.programInput.update();



        react.subscribe({
            name:"sim." + self.name,
            callback:function (x) {
                self.sdata = x;
            }
        })
	}

	var enter = function (self, $scope) {


        if (!pageBuilt) {

            $input.createInput(self.name)

        }
        else {

            $input.setName(self.name);

        }


        evolve.setup(self.name);


        $input.masterReset();
        

        $input.setInput({
            name:self.name,
            programInput:self.programInput
        })

        react.push({
            name:"data" + self.name,
            state:{input:$input.getInput()}
        })


        $scope.settings = $input.setSettings($scope, $input.getInput(false));
	}

	var refresh = function (self, $scope) {

        evolve.running(false, $scope);
        simulator.refresh();
    }

    var restart = function (self, $scope) {

        
        evolve.running(false, $scope);
        simulator.reset();
    }

    var step = function (self, $scope) {

        evolve.running(true, $scope);
        simulator.step($scope.session);
    }

    var play = function (self, $scope) {
        
        evolve.running(true, $scope);
        simulator.play($scope.session, false);
    }

    var stop = function (self, $scope) {

        evolve.running(false, $scope);
        simulator.stop();  
    }

    var run = function (self, $scope) {

        evolve.run($scope);
    }


    var breakRun = function (self, $scope) {

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
		play:play,
		stop:stop,
        run:run,
        breakRun:breakRun
	}


}]);