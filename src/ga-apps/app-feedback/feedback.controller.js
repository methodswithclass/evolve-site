app.controller("feedback.controller", ['$scope', 'feedback-sim', 'data', 'utility', 'send.service', 'events.service', 'react.service', 'display.service', 'input.service', 'api.service', 'config.service', 'evolve.service', 'loading.service', function ($scope, simulator, data, u, send, events, react, display, $input, api, config, evolve, loading) {

    var self = this;


    self.name = "feedback";
    $scope.name = self.name;

    $scope.programInput;

    var processTypes;
    var displayParams = display.getParams();
        

    var pageBuilt = display.beenBuilt(self.name);


    console.log("\n\n\ncontroller", self.name, "built", pageBuilt, "\n\n\n")


    var phases = [
    {
        message:"processing", 
        delay:300,
        duration:600,
        phase:function (options) {
            

            enter();

            display.elementsToggle(self.name, "hide");

            if (typeof options.complete === "function") options.complete();

        }
    },
    {
        message:"initialize genetic algoirthm", 
        delay:300,
        duration:600,
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

                $scope.resetgen();


                setTimeout(function () {

                    if (typeof options.complete === "function") options.complete() 
                }, options.duration)

            }


        }
    },
    {
        message:"load environment", 
        delay:300,
        duration:displayParams.fade, 
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
        delay:300,
        duration:displayParams.fade,
        phase:function (options) {


            display.load(self.name);


            setTimeout(function () {

                if (typeof options.complete === "function") options.complete() 
            }, options.duration)
        }
    },
    {
        message:"complete", 
        delay:300,
        duration:displayParams.fade, 
        phase:function (options) {
            

            console.log("getting things ready phase, finish loading");


            evolve.running(false, $scope);

            u.toggle("hide", "loading", {fade:displayParams.fade, delay:displayParams.delay});

            display.elementsToggle(self.name, "show");


            display.isBuilt(self.name);

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


        display.waitForElem({elems:"#loadingtoggle"}, function (options) {

            console.log("load controller", self.name);

            loading.init($scope, phases);

            u.toggle("show", "loading", {fade:displayParams.fade});

            loading.runPhase(0);
        })
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

    }


    var enter = function () {

        console.log("enter controller", self.name);


        if (!pageBuilt) {

            $input.createInput(self.name);
        }
        else {

            $input.setName(self.name);
        }


        evolve.setup(self.name);


        $input.setInput({
            name:self.name,
            programInput:$scope.programInput
        })

        $scope.settings = $input.setSettings($scope, $input.getInput(false));

    }


    
    build();
    
    load();


}]);