app.controller("trash.controller", ['$scope', '$http', 'trash-sim', 'utility', 'global.service', 'react.service', 'events.service', "display.service", 'api.service', 'input.service', 'config.service', function ($scope, $http, simulator, u, g, react, events, display, api, $input, config) {

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

    var programInput = config.get("global.trash");
    
    programInput.getTotalSteps = function () {

        return programInput.grid.size*programInput.grid.size*2;
    }

    programInput.convertTrash = function (percentToRate) {

        return percentToRate ? programInput.trashPercent/100 : programInput.trashRate*100;
    }

    programInput.trashRate = programInput.convertTrash(true);
    programInput.totalSteps = programInput.getTotalSteps();


    programInput.validate = function () {

        var _temp = {
            grid:programInput.grid.size,
            percent:programInput.trashPercent,
            rate:programInput.trashRate
        }

        programInput.grid.size = programInput.grid.size >= 3 && programInput.grid.size <= 15 ? parseInt(programInput.grid.size) : 5;

        programInput.trashPercent = programInput.trashPercent >= 0 
           && programInput.trashPercent <= 90
           && parseInt(programInput.trashPercent) 
        ? parseInt(programInput.trashPercent) : "";
       


        programInput.trashRate = programInput.trashRate >= 0 
           && programInput.trashRate <= 0.9 
           && parseFloat(programInput.trashRate) 
        ? parseFloat(programInput.trashRate) : 0;


        if (_temp.grid != programInput.grid.size || _temp.percent != programInput.trashPercent || _temp.rate != programInput.trashRate) {

            programInput.update();
        }

    }


    programInput.update = function () {


        programInput.trashRate = programInput.convertTrash(true);
        programInput.totalSteps = programInput.getTotalSteps();

        programInput.validate();
    }



    programInput.update();


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
    $scope.goals = programInput.goals;

    
    var displayDelay = 100;

    var displayfade = 800;
    var loadfadeout = 800;

    $scope.programInputChange = function () {

        // console.log("grid size", programInput.grid.size);

        programInput.update();

        console.log("program input change");

        $input.setInput({
            programInput:programInput
        })


        setTimeout(function () {

            simulator.refresh($scope.session);

        }, 1000);

    }

    var phases = [
    {
        message:"processing", 
        delay:0,
        duration:0,
        phase:function (complete) {

            console.log("processing phase");            

            $input.setInput({
                name:self.name,
                programInput:programInput
            });

            console.log("processing phase get input then set settings");

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

            display.load(programInput);

            if (complete) complete();
        }
    },
    {
        message:"getting things ready", 
        delay:600,
        duration:loadfadeout, 
        phase:function (complete) {

            console.log("getting things ready phase, finish loading");

            $("#loadinginner").animate({opacity:0}, {
                duration:loadfadeout, 
                complete:function () {

                    console.log("hide loading"); 

                    $scope.running(false);

                    
                    u.toggle("hide", "loading", {fade:loadfadeout});                    
                    u.toggle("show", "hud", {fade:loadfadeout, delay:displayDelay});

                    u.toggle("show", "refresh", {fade:loadfadeout, delay:displayDelay});
                    u.toggle("show", "restart", {fade:loadfadeout, delay:displayDelay});
                    u.toggle("show", "step", {fade:loadfadeout, delay:displayDelay});
                    u.toggle("show", "play", {fade:loadfadeout, delay:displayDelay});
                    u.toggle("show", "stop", {fade:loadfadeout, delay:displayDelay});


                    u.toggle("enable", "refresh", {fade:loadfadeout, delay:displayDelay});

                    u.toggle("show", "run", {fade:loadfadeout, delay:displayDelay});
                    u.toggle("show", "settings", {fade:loadfadeout, delay:displayDelay});

                    react.push({
                        name:"programInput" + self.name,
                        state:programInput
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