app.controller("trash.controller", ['$scope', 'trash-sim', 'utility', 'global.service', 'react.service', 'events.service', "display.service", 'api.service', 'input.service', 'config.service', 'evolve.service', function ($scope, simulator, u, g, react, events, display, api, $input, config, evolve) {

    var self = this;


    self.name = "trash";
    $scope.name = self.name;
    self.sdata;

    $scope.settings;
    $scope.grids;
    $scope.programInput;

    var processTypes;
    var displayParams = display.getParams();


    var pageBuilt = display.beenBuilt(self.name);


    console.log("\n\n\ncontroller", self.name, "built", pageBuilt, "\n\n\n")


    self.outcome = function (outcome) {

        if ((self.sdata && self.sdata.move.action.id == 4) || outcome !== "success") {

            return "/assets/img/ex.png";
        }
        else {
            return "/assets/img/check.png";
        }

    }


    $scope.programInputChange = function () {

        // console.log("grid size", programInput.grid.size);

        $scope.programInput.update();

        // console.log("program input change");

        $input.setInput({
            programInput:$scope.programInput
        })


        setTimeout(function () {

            simulator.refresh();

        }, 1000);

    }

    var programInputConfig = function () {

        var $parent = $("#programConfig");

        $parent.css({height:(g.isMobile() ? "60%" : "80%")})
    }


    var setupProgramInputConfig = function () {

        setTimeout(function () {

            programInputConfig();


            $(window).resize(function () {

                programInputConfig();
            })

        }, 1000);

    }


    var phases = [
    {
        message:"processing", 
        delay:0,
        duration:0,
        phase:function (options) {

            console.log("processing phase");

            enter();

            display.elementsToggle(self.name, "hide");

            setTimeout(function () {

                if (typeof options.complete === "function") options.complete() 
            }, options.duration)

        }
    },
    {
        message:"initializing evolutionary algoirthm", 
        delay:600,
        duration:0,
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

                            setTimeout(function () {

                                if (typeof options.complete === "function") options.complete() 
                            }, options.duration)

                        });

                    })
                    
                })

            }
            else {

                api.initialize(function () {

                    api.setInput(false, function (res) {

                        setTimeout(function () {

                            if (typeof options.complete === "function") options.complete() 
                        }, options.duration) 

                    });

                })
            }

        }
    },
    {
        message:"loading environment", 
        delay:600,
        duration:0, 
        phase:function (options) {

            console.log("load environment phase");

            
            api.refreshEnvironment(function (res) {

                console.log("Refresh environment", res);

                react.push({
                    name:"create.env",
                    state:res.data.env
                })

                setTimeout(function () {

                    if (typeof options.complete === "function") options.complete() 
                }, options.duration)

            })

        }
    },
    {
        message:"loading display", 
        delay:600,
        duration:displayParams.fade,
        phase:function (options) {

            console.log("load display phase");

            display.load(self.name);

            setTimeout(function () {

                if (typeof options.complete === "function") options.complete() 
            }, options.duration)
        }
    },
    {
        message:"getting things ready", 
        delay:600,
        duration:displayParams.fade, 
        phase:function (options) {

            console.log("getting things ready phase, finish loading");


            evolve.running(false, $scope);

            u.toggle("hide", "loading", {fade:displayParams.fade, delay:displayParams.delay});

            display.elementsToggle(self.name, "show");

            $scope.programInputChange();

            react.push({
                name:"programInput" + self.name,
                state:$scope.programInput
            })


            setTimeout(function () {

                if (typeof options.complete === "function") options.complete() 
            }, options.duration)


        }
    }
    ]

    var load = function () {

        console.log("load controller", self.name);

        setTimeout(function () {

            $scope.initLoading(phases);

            u.toggle("show", "loading", {fade:displayParams.fade});

            $scope.runPhase(0);

        }, 500);
    }
    
    self.refresh = function () {

        $scope.running(false);
        simulator.refresh();
    }

    self.restart = function () {

        
        $scope.running(false);
        simulator.reset();
    }

    self.step = function () {

        $scope.running(true);
        simulator.step($scope.session);
    }

    self.play = function () {
        
        $scope.running(true);
        simulator.play($scope.session, false);
    }

    self.stop = function () {

        $scope.running(false);
        simulator.stop();  
    }



    var build = function () {
       

        console.log("build controller", self.name);


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

        $scope.programInput = config.get("global.trash");
        
        $scope.programInput.getTotalSteps = function () {

            return $scope.programInput.grid.size*$scope.programInput.grid.size*2;
        }

        $scope.programInput.convertTrash = function (percentToRate) {

            return percentToRate ? $scope.programInput.trashPercent/100 : $scope.programInput.trashRate*100;
        }

        $scope.programInput.trashRate = $scope.programInput.convertTrash(true);
        $scope.programInput.totalSteps = $scope.programInput.getTotalSteps();


        $scope.programInput.validate = function () {

            var _temp = {
                grid:$scope.programInput.grid.size,
                percent:$scope.programInput.trashPercent,
                rate:$scope.programInput.trashRate
            }

            $scope.programInput.grid.size = $scope.programInput.grid.size >= 3 && $scope.programInput.grid.size <= 15 ? parseInt($scope.programInput.grid.size) : 5;

            $scope.programInput.trashPercent = $scope.programInput.trashPercent >= 0 
               && $scope.programInput.trashPercent <= 90
               && parseInt($scope.programInput.trashPercent) 
            ? parseInt($scope.programInput.trashPercent) : "";
           


            $scope.programInput.trashRate = $scope.programInput.trashRate >= 0 
               && $scope.programInput.trashRate <= 0.9 
               && parseFloat($scope.programInput.trashRate) 
            ? parseFloat($scope.programInput.trashRate) : 0;


            if (_temp.grid != $scope.programInput.grid.size || _temp.percent != $scope.programInput.trashPercent || _temp.rate != $scope.programInput.trashRate) {

                $scope.programInput.update();
            }

        }


        $scope.programInput.update = function () {


            $scope.programInput.trashRate = $scope.programInput.convertTrash(true);
            $scope.programInput.totalSteps = $scope.programInput.getTotalSteps();

            $scope.programInput.validate();
        }

        $scope.programInput.checkInput = function (input1, input2) {

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


        $scope.programInput.update();



        react.subscribe({
            name:"sim." + self.name,
            callback:function (x) {
                self.sdata = x;
            }
        })

        display.isBuilt(self.name);

    }



    var enter = function () {

        setupProgramInputConfig();


        if (!pageBuilt) {

            $input.createInput(self.name);


            $input.resetInput();

            $input.setInput({
                name:self.name,
                programInput:$scope.programInput
            })
            

        }
        else {

            $input.setName(self.name);

            $input.resetInput();

        }


        


        $scope.settings = $input.setSettings($scope, $input.getInput(false));


        evolve.setup(self.name);

    }



    build();

    load();


}]);