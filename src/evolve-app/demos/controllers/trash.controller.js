app.factory("trash.controller", ["data", "trash-sim", "utility", 'api.service', 'config.service', 'evolve.service', 'input.service', 'display.service', function (data, simulator, u, api, config, evolve, $input, display) {


	var pageBuilt;


    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;

    // console.log("types", processTypes);

    var d = data.get("trash");

	var setup = function (self, $scope) {


		pageBuilt = display.beenBuilt(self.name);


        react.subscribe({
            name:"sim." + self.name,
            callback:function (x) {
                self.sdata = x;
            }
        })


		self.outcome = function (outcome) {

	        if ((self.sdata && self.sdata.move.action.id == 4) || outcome !== "success") {

	            return "/assets/img/ex.png";
	        }
	        else {
	            return "/assets/img/check.png";
	        }

	    }


	    self.programInputChange = function () {

            // console.log("program input change", self.programInput, "set input");

	        self.programInput.update();

	        $input.setInput({
	            programInput:self.programInput
	        })

            simulator.refresh();

	    }

	}

	var finish = function (self, $scope) {

        return new Promise(function (resolve, reject) {

            self.programInputChange();

            var result;

            // opacityScroll()
            // .then(function (result) {

                resolve(result || true);
            // })

        });

	}

	var createEnvironment = function (self, $scope) {

  		// events.dispatch("refreshenv");

        simulator.refreshenv();
	}


    var getType = function (input, processTypes) {

        // console.log("input in function", input);
        return (typeof input.processIndex !== "undefinded") ? processTypes[input.processIndex] : processTypes[0];
    }



    var setupProgramInput = function (self, programInput, processTypes) {



        programInput.processType = getType(self.programInput, processTypes);


        programInput.getTotalSteps = function () {

            return self.programInput.grid.size*self.programInput.grid.size*2;
        }

        programInput.convertTrash = function (percentToRate) {

            return percentToRate ? self.programInput.trashPercent/100 : self.programInput.trashRate*100;
        }

        programInput.validate = function () {


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


        programInput.update = function () {


            self.programInput.trashRate = self.programInput.convertTrash(true);
            self.programInput.totalSteps = self.programInput.getTotalSteps();

            self.programInput.validate();
        }

        programInput.checkInput = function (input1, input2) {

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



        programInput.update();

        return programInput;

    }



	var build = function (self, $scope) {


        $scope.grids = d.grids;

        self.programInput;
        
	}

	var enter = function (self, $scope, complete) {

        pageBuilt = display.beenBuilt(self.name);


        var createComplete = function (name) {


            // $input.masterReset();

            evolve.setup(name);
            

            $input.setInput({
                name:name,
                programInput:self.programInput
            })

            react.push({
                name:"data" + name,
                state:{input:$input.getInput()}
            })


            $scope.settings = $input.setSettings($scope, $input.getInput());

            if (typeof complete === "function") complete(name);

        }


        config.get([
                   "global.programs.trash",
                   "global.types.processTypes"
                   ])
        .then(function (data) {


            self.programInput = data[0];

            var processTypes = data[1];

            self.programInput = setupProgramInput(self, self.programInput, processTypes);

            console.log("processtype", self.programInput.processType);

            $input.createInput(self.name, function () {
                
                createComplete(self.name);
            })

        })


        

       

	}

	var refresh = function (self, $scope) {

        evolve.running(false, $scope);
        simulator.refresh();
    }

    var restart = function (self, $scope) {

        console.log("restart simulation");

        evolve.running(false, $scope);
        simulator.reset();
    }

    var step = function (self, $scope) {

        evolve.running(true, $scope);
        var input = $input.getInput();
        simulator.step(input.session);
    }

    var play = function (self, $scope) {
        
        evolve.running(true, $scope);
        var input = $input.getInput();
        simulator.play(input.session, false);
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