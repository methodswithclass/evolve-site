app.controller("feedback.controller", ['$scope', 'feedback-sim', 'data', 'utility', 'send.service', 'events.service', 'react.service', 'display.service', 'input.service', 'api.service', 'config.service', 'evolve.service', function ($scope, simulator, data, u, send, events, react, display, $input, api, config, evolve) {

    var self = this;


    self.name = "feedback";
    $scope.name = self.name;

    $scope.programInput;

    var processTypes;
    var displayDelay;
    var displayfade;
        

    var pageBuilt = display.beenBuilt(self.name);


    console.log("\n\n\npage built", self.name, pageBuilt, "\n\n\n")


    var phases = [
    {
        message:"processing", 
        delay:600,
        duration:displayfade,
        phase:function (options) {
            

            enter();

            display.elementsToggle(self.name, "hide");

            if (typeof options.complete === "function") options.complete();

        }
    },
    {
        message:"initialize genetic algoirthm", 
        delay:600,
        duration:displayfade,
        phase:function (options) {


            console.log("initialize algorithm phase");
            

            if (!pageBuilt) {
                
                api.instantiate(function (res) {

                    console.log("Instantiate session", res);

                    $scope.session = res.data.session;

                    $input.setInput({
                        session:$scope.session
                    })
                    
                    api.initialize(function () {

                        api.setInput(false, function (res) {

                            
                            setTimeout(function () {

                                if (typeof options.complete === "function") options.complete() 
                            }, options.duration)

                        });

                    })
                    
                })

            }
            else {

                // api.initialize(function (res) {

                //     console.log("Initialize session", res);

                //     api.setInput(false, function (res) {

                //         setTimeout(function () {

                //             if (typeof options.complete === "function") options.complete() 
                //         }, options.duration)

                //     });

                // })

                $scope.resetgen();

            }


        }
    },
    {
        message:"load environment", 
        delay:600,
        duration:displayfade, 
        phase:function (options) {
            
            console.log("load environment");

            simulator.create();
            simulator.reset();


            setTimeout(function () {

                if (typeof options.complete === "function") options.complete() 
            }, options.duration)

        }
    },
    {
        message:"load display", 
        delay:600,
        duration:displayfade,
        phase:function (options) {


            display.load(self.name);


            setTimeout(function () {

                if (typeof options.complete === "function") options.complete() 
            }, options.duration)
        }
    },
    {
        message:"complete", 
        delay:600,
        duration:displayfade, 
        phase:function (options) {
            

            console.log("getting things ready phase, finish loading");


            evolve.running(false, $scope);

            u.toggle("hide", "loading", {fade:displayfade, delay:displayDelay});

            display.elementsToggle(self.name, "show");


            setTimeout(function () {

                if (typeof options.complete === "function") options.complete() 
            }, options.duration)

        }
    }
    ]


    self.refresh = function () {

        evolve.running(false, $scope);
        simulator.refresh();
        $scope.resetgen();
    }

    self.step = function (dna) {


        simulator.step(dna, 200);
    }

    self.play = function () {
        
        $scope.run();
    }

    self.stop = function () {

        $scope.breakRun();
    }


    var load = function () {

        console.log("load controller", self.name);

        setTimeout(function () {

            $scope.initLoading(phases);

            u.toggle("show", "loading", {fade:displayfade});

            $scope.runPhase(0);

        }, 500);
    }


    var build = function () {

        console.log("build controller", self.name);

        react.subscribe({
            name:"ev.feedback",
            callback:function (x) {

                self.step(x.best.dna);
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


        displayDelay = 100;
        displayfade = 800;

    }


    var enter = function () {

        console.log("enter controller", self.name);

        $input.resetInput();

        $input.setInput({
            name:self.name,
            programInput:$scope.programInput
        })

        var input = $input.getInput(false);

        evolve.setup(self.name);

        $scope.settings = $input.setSettings($scope, input);

    }


    if (!pageBuilt) {
        build();
        display.isBuilt(self.name);
    }

    
    load();


}]);