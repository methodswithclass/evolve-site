app.controller("trash.controller", ['$scope', 'trash-sim', 'utility', 'global.service', 'react.service', 'events.service', "display.service", 'api.service', 'input.service', 'config.service', 'evolve.service', function ($scope, simulator, u, g, react, events, display, api, $input, config, evolve) {

    var self = this;

    self.name = "trash";
    $scope.name = self.name;
    self.sdata;

    console.log("\n@@@@@@@@@@@@@\nenter trash controller\n\n");


    // $scope.gridSize = 5;

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


    var processTypes = config.get("types.processTypes")

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


    events.on("completeSim", function () {

        $scope.running(false);
    });

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

    $scope.settings;
    $scope.goals = $scope.programInput.goals;

    
    var displayDelay = 100;

    var displayfade = 800;

    $scope.programInputChange = function () {

        // console.log("grid size", programInput.grid.size);

        $scope.programInput.update();

        // console.log("program input change");

        $input.setInput({
            programInput:$scope.programInput
        })


        setTimeout(function () {

            simulator.refresh($scope.session);

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

    setupProgramInputConfig() 

    var phases = [
    {
        message:"processing", 
        delay:0,
        duration:0,
        phase:function (complete) {

            console.log("processing phase");

            // console.log("processing phase get input then set settings");

            evolve.setup(self.name);

            $input.setInput({
                name:self.name,
                programInput:$scope.programInput
            })

            $scope.settings = $input.setSettings($scope, $input.getInput(false));


            u.toggle("hide", "evolve");
            u.toggle("hide", "hud");

            u.toggle("hide", "run");
            u.toggle("hide", "play");
            u.toggle("hide", "refresh");
            u.toggle("hide", "restart");
            u.toggle("hide", "step");
            u.toggle("hide", "stop");

            u.toggle("hide", "settings");



            u.toggle("disable", "refresh");
            u.toggle("disable", "restart");
            u.toggle("disable", "step");
            u.toggle("disable", "play");
            u.toggle("disable", "stop");

            complete();

        }
    },
    {
        message:"initializing evolutionary algoirthm", 
        delay:600,
        duration:0,
        phase:function (complete) {

            console.log("initialize algorithm phase");
            

            api.instantiate(function (res) {

                console.log("Instantiate session", res);

                $scope.session = res.data.session;

                console.log("instantiate complete");

                $input.setInput({
                    session:$scope.session
                })
                
                api.initialize($scope, function () {

                    api.setInput($scope, false, function (res) {

                        if (complete) complete() 

                    });

                })
                
            })

        }
    },
    {
        message:"loading environment", 
        delay:600,
        duration:0, 
        phase:function (complete) {

            console.log("load environment phase");

            
            api.refreshEnvironment($scope, function (res) {

                console.log("Refresh environment", res);

                react.push({
                    name:"create.env",
                    state:res.data.env
                })

                if (complete) complete();

            })

        }
    },
    {
        message:"loading display", 
        delay:600,
        duration:displayfade,
        phase:function (complete) {

            console.log("load display phase");

            
            u.toggle("show", "stage", {fade:300});
            u.toggle("show", "controls", {fade:300});
            u.toggle("show", "simdata", {fade:300});
            u.toggle("show", "evolvedata", {fade:300});

            display.load(self.name);

            if (complete) complete();
        }
    },
    {
        message:"getting things ready", 
        delay:600,
        duration:displayfade, 
        phase:function (complete) {

            console.log("getting things ready phase, finish loading");

            $("#loadinginner").animate({opacity:0}, {
                duration:displayfade, 
                complete:function () {

                    console.log("hide loading"); 

                    evolve.running(false);

                    
                    u.toggle("hide", "loading", {fade:displayfade});                    
                    u.toggle("show", "hud", {fade:displayfade, delay:displayDelay});

                    u.toggle("show", "refresh", {fade:displayfade, delay:displayDelay});
                    u.toggle("show", "restart", {fade:displayfade, delay:displayDelay});
                    u.toggle("show", "step", {fade:displayfade, delay:displayDelay});
                    u.toggle("show", "play", {fade:displayfade, delay:displayDelay});
                    u.toggle("show", "stop", {fade:displayfade, delay:displayDelay});


                    u.toggle("enable", "refresh", {fade:displayfade, delay:displayDelay});

                    u.toggle("show", "run", {fade:displayfade, delay:displayDelay});
                    u.toggle("show", "settings", {fade:displayfade, delay:displayDelay});


                    $scope.programInputChange();


                    react.push({
                        name:"programInput" + self.name,
                        state:$scope.programInput
                    })


                    if (complete) complete();
                }
            });
        }
    }
    ]

    var load = function () {

        setTimeout(function () {

            react.push({
                name:"phases" + self.name,
                state:phases
            });

            events.dispatch("load" + self.name);

        }, 500);
    }
    
    self.refresh = function () {

        $scope.running(false);
        simulator.refresh($scope.session);
    }

    self.restart = function () {

        
        $scope.running(false);
        simulator.reset($scope.session);
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

    

    load();


}]);