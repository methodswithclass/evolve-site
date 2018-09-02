app.factory("feedback.controller", ["feedback-sim", "utility", 'config.service', 'evolve.service', 'input.service', 'display.service', function (simulator, u, config, evolve, $input, display) {


    var pageBuilt;


    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;


    var programInput;


    config.get("global.programs.feedback")
    .then(function (data) {

        programInput = data;

    })


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

        // config.get("global.feedback")
        // .then(function(data) {

        //     $scope.programInput = data;
        // })

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

            $input.createInput(self.name, function () {


                evolve.setup(self.name);

                $input.setInput({
                    name:self.name,
                    programInput:programInput
                })

                $scope.settings = $input.setSettings($scope, $input.getInput(false));

            });
        }
        else {

            $input.setName(self.name);
        }

        
    }


    var refresh = function (self, $scope) {

        evolve.running(false, $scope);
        simulator.refresh();
        evolve.resetgen();
    }

    var step = function (self, $scope, dna) {

        setTimeout(function () {

            simulator.step(dna, programInput.duration);

        }, programInput.evdelay);
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
        step:step,
        run:run,
        stop:stop

    }


}]);