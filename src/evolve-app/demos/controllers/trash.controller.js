app.factory("trash.controller", ["data", "trash-sim", "utility", 'api.service', 'config.service', 'evolve.service', 'input.service', 'display.service', function (data, simulator, u, api, config, evolve, $input, display) {


	var pageBuilt;


    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;

    var processTypes

    config.get("global.types.processTypes")
    .then((data) => {

        processTypes = data;
    })

    // console.log("types", processTypes);

    var d = data.get("trash");

    var getProcessType = function (input) {

        // console.log("input in function", input);
        return (typeof input.processIndex !== "undefinded") ? processTypes[input.processIndex] : undefined;
    }


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

    var opacityScroll = function () {

        var main = "#main-back";
        
        var run = "#runtoggle";
        var sim = "#simParent";
        var config = "#programConfig";

        var displays = {
            block:"block",
            none:"none"
        }

        var scrollTop = 0;
        var opacity =  {
            run:0,
            sim:0,
            config:0
        };

        var objDisplay = {
            run:displays.block,
            sim:displays.block,
            config:displays.block
        }


        return new Promise((resolve, reject) => {




            var scrollFunc = function () {

                var params = {
                    factor:{
                        run:0.4,
                        sim:0.2,
                        config:0.2
                    },
                    offset:{
                        run:0,
                        sim:$(window).height()*0.1,
                        config:$(window).height()*0.15
                    }
                }

                scrollTop = $(main).scrollTop();
                        
                opacity = {
                    run:1 - (scrollTop*params.factor.run - params.offset.run)/100,
                    sim:(scrollTop*params.factor.sim - params.offset.sim)/100,
                    config:(scrollTop*params.factor.config - params.offset.config)/100
                }


                for (var i in opacity) {

                    if (opacity[i] <= 0) {
                        opacity[i] = 0;
                        objDisplay[i] = displays.none;
                    }
                    else if (opacity[i] >= 1) {
                        opacity[i] = 1;
                        objDisplay[i] = displays.block;
                    }
                    else {
                        objDisplay[i] = displays.block;
                    }
                }


                g.waitForElem({elems:run}, function () {

                    $(run).css({opacity:opacity.run, display:objDisplay.run});
                    $(sim).css({opacity:opacity.sim});
                    $(config).css({opacity:opacity.config});

                })
            }

            var mobileFunc = function () {

                scrollTop = $(main).scrollTop();

                if (scrollTop > 100) {
                    $(run).css({opacity:0});
                }
                else {
                    $(run).css({opacity:1});
                }
            }


            var scrollCase = function () {

                if (g.isMobile()) {
                    mobileFunc();
                }
                else {
                    scrollFunc();
                }

                $(main).scroll(() => {

                    if (g.isMobile()) {
                        mobileFunc();
                    }
                    else {
                        scrollFunc();
                    }
                });


                $(main).resize(() => {

                    if (g.isMobile()) {
                        mobileFunc();
                    }
                    else {
                        scrollFunc();
                    }
                })
            }


            g.waitForElem({elems:config}, function () {


                scrollCase();

                resolve(true);

            });

        });

    }

	var finish = function (self, $scope) {

        return new Promise((resolve, reject) => {

            self.programInputChange();

            var result;

            // opacityScroll()
            // .then((result) => {

                resolve(result || true);
            // })

        });

	}

	var createEnvironment = function (self, $scope) {

  		// events.dispatch("refreshenv");

        simulator.refreshenv();
	}



    var setupProgramInput = function (self, data) {



        self.programInput = data;


        self.programInput.processType = getProcessType(self.programInput);


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


    }



	var build = function (self, $scope) {


        $scope.grids = d.grids;

        self.programInput

        config.get("global.programs.trash")
        .then((data) => {


            setupProgramInput(self, data);

        })
        
	}

	var enter = function (self, $scope) {


        if (!pageBuilt) {

            $input.createInput(self.name, function () {


                evolve.setup(self.name);
                

                $input.setInput({
                    name:self.name,
                    programInput:self.programInput
                })

                react.push({
                    name:"data" + self.name,
                    state:{input:$input.resendInput()}
                })


                $scope.settings = $input.setSettings($scope, $input.getInput());

            })

        }
        else {

            $input.setName(self.name);

        }

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