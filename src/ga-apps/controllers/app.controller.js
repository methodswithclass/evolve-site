app.controller("app.controller", ['$scope', 'simulators', 'controllers', 'states', 'utility', 'global.service', 'react.service', 'events.service', "display.service", 'api.service', 'input.service', 'config.service', 'evolve.service', 'loading.service', function ($scope, simulators, controllers, states, u, g, react, events, display, api, $input, config, evolve, loading) {

    var self = this;


    self.name = u.stateName(states.current());
    $scope.name = self.name;
    self.sdata;

    $scope.settings;
    $scope.grids;
    $scope.programInput;

    var processTypes;
    var displayParams = display.getParams();

    console.log("name is", self.name);

    var simulator = simulators.get(self.name);
    var controller = controllers.get(self.name);

    var pageBuilt = display.beenBuilt(self.name);


    console.log("\n\n\ncontroller", self.name, "built", pageBuilt, "\n\n\n")


    controller.setup(self, $scope);



    var next = function (options) {


        setTimeout(function () {

            if (typeof options.complete === "function") options.complete() 
        }, options.duration)
    }


    var phases = [
    {
        message:"processing", 
        delay:300,
        duration:600,
        phase:function (options) {

            console.log("processing phase");

            enter();

            display.elementsToggle(self.name, "hide");

            next(options);

        }
    },
    {
        message:"initializing evolutionary algoirthm", 
        delay:300,
        duration:600,
        phase:function (options) {

            console.log("initialize algorithm phase");
            
            if (!pageBuilt) {
               
                api.instantiate(function (res) {

                    console.log("Instantiate session", res);

                    $scope.session = res.data.session;

                    console.log("instantiate complete");

                    $input.setInput({
                        session:$scope.session
                    })
                    
                    api.initialize(function () {

                        api.setInput(false, function (res) {

                            next(options);

                        });

                    })
                    
                })

            }
            else {

                $scope.resetgen();


                next(options);
            }

        }
    },
    {
        message:"loading environment", 
        delay:300,
        duration:displayParams.fade, 
        phase:function (options) {

            console.log("load environment phase");

            
            controller.createEnvironment(self, $scope);


            next(options);

        }
    },
    {
        message:"loading display", 
        delay:300,
        duration:displayParams.fade,
        phase:function (options) {

            console.log("load display phase");

            display.load(self.name);

            next(options);
        }
    },
    {
        message:"getting things ready", 
        delay:300,
        duration:displayParams.fade, 
        phase:function (options) {

            console.log("getting things ready phase, finish loading");


            evolve.running(false, $scope);

            u.toggle("hide", "loading", {fade:displayParams.fade, delay:displayParams.delay});

            display.elementsToggle(self.name, "show");

            controller.finish(self, $scope);

            display.isBuilt(self.name);
            
            
            next(options);
            
        }
    }
    ]


    var load = function () {


        display.waitForElem({elems:"#loadingtoggle"}, function (options) {

            console.log("load controller", self.name);

            loading.init($scope, phases);

            u.toggle("show", "loading", {
                fade:displayParams.fade,
                complete:function () {

                    
                    loading.runPhase(0);
                }
            });
        })
    }
    
    self.refresh = function () {

        controller.refresh(self, $scope)
    }

    self.restart = function () {

        
        controller.restart(self, $scope);
    }

    self.step = function () {

        controller.step(self, $scope);
    }

    self.play = function () {
        
        controller.play(self, $scope);
    }

    self.stop = function () {

        controller.stop(self, $scope);
    }



    var build = function () {
        
        controller.build(self, $scope);
    }



    var enter = function () {

        controller.enter(self, $scope);
    }



    build();

    load();


}]);