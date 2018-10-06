app.factory("feedback.controller", ["feedback-sim", "utility", 'config.service', 'evolve.service', 'input.service', 'display.service', function (simulator, u, config, evolve, $input, display) {


    var pageBuilt;


    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;


    var programInput;
    var stepCount = 0;
    var stepFirst = true;
    var stepFireCount;

    config.get("global.programs.feedback")
    .then(function (data) {

        programInput = data;

        stepFireCount = programInput.stepFireCount;

    })

    var onDataCallStep = function (dna, step) {

        //called during subscribe in build function

        // console.log("stepcount", stepCount, stepFireCount, dna);

        if (stepFirst || stepCount == stepFireCount) {

            stepCount = 0;

            // dna = 
            step(null, null, dna);
        }

        stepCount++;
        stepFirst = false;
        
    }


    var setup = function (self, $scope) {

        pageBuilt = display.beenBuilt(self.name);

    }


    var createEnvironment = function (self, $scope) {

        simulator.create();
        simulator.reset();
    }


    var finish = function (self, $scope) {

        return new Promise(function (resolve, reject) {

            resolve(true);
        });
    }

    var build = function (self, $scope) {

        console.log("build controller", self.name);

        $scope.programInput = programInput;


        react.subscribe({
            name:"data" + "feedback",
            callback:function (x) {

                var dna = (x.evdata ? (x.evdata.best ? x.evdata.best.dna : []) : [])

                if (dna && dna.length > 0) {

                    // console.log("dna", dna);
                    onDataCallStep(dna, step)
                }
            }

        });


        react.subscribe({
            name:"sim." + self.name,
            callback:function (x) {
                self.sdata = x;
            }
        });
    }

    var enter = function (self, $scope, complete) {

        console.log("enter controller", self.name);


        pageBuilt = display.beenBuilt(self.name);


        var createComplete = function (name) {


            evolve.setup(name);

            $input.setInput({
                name:name,
                programInput:programInput
            })

            $scope.settings = $input.setSettings($scope, $input.getInput(false));


            if (typeof complete === "function") complete(name);

        }

        if (!pageBuilt) {

            $input.createInput(self.name, function () {

                createComplete(self.name)
            });
        }
        else {
            // $input.masterReset();
            createComplete(self.name);
        }

        
    }


    var refresh = function (self, $scope) {

        evolve.running(false, $scope);
        // simulator.refresh();
        evolve.resetgen(true);
        stepCount = 0;
        stepFirst = true;
        stepFireCount = programInput.stepFireCount;
    }

    var step = function (self, $scope, dna) {

        simulator.step(dna, programInput.duration);
    }


    var run = function (self, $scope) {
        
        evolve.run($scope);
        // stepCount = 0;
        // stepFireCount = programInput.stepFireCount;
    }

    var stop = function (self, $scope) {

        simulator.stop();
        stepCount = 0;

        evolve.breakRun($scope); 
    }

    return {
        setup:setup,
        createEnvironment:createEnvironment,
        finish:finish,
        build:build,
        enter:enter,
        refresh:refresh,
        step:step,
        run:run,
        stop:stop

    }


}]);