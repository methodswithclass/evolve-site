app.controller("trash.controller", ['$scope', '$http', 'trash-sim', 'utility', 'global.service', 'react.service', 'events.service', "display.service", 'api.service', function ($scope, $http, simulator, u, g, react, events, display, api) {

    var self = this;

    self.name = "trash";
    $scope.name = self.name;
    self.sdata;

    console.log("\n@@@@@@@@@@@@@\nenter trash controller\n\n");

    

    // var a = 2; var b = 3;

    // var getTotalSteps = function () {

    //     $scope.programInput.totalSteps = $scope.programInput.gridSize*$scope.programInput.gridSize*2;
    // }

    
    $scope.programInput = {
        goals:[{goal:"min"}, {goal:"max"}],
        gridSize:5,
        trashRate:0.5,
        getTotalSteps:function () {

            return $scope.programInput.gridSize*$scope.programInput.gridSize*2;
        }
    }

    $scope.programInput.totalSteps = $scope.programInput.getTotalSteps();

    $scope.programInput.update = function () {

        $scope.programInput.totalSteps = $scope.programInput.getTotalSteps();
    }

    $scope.programInput.update();


    $scope.gridSizes = [
    {
        gridsize:3
    },
    {
        gridsize:4
    },
    {
        gridsize:5
    },
    {
        gridsize:6
    },
    {
        gridsize:7
    },
    {
        gridsize:8
    },
    {
        gridsize:9
    },
    {
        gridsize:10
    },
    {
        gridsize:11
    },
    {
        gridsize:12
    },
    {
        gridsize:13
    },
    {
        gridsize:14
    },
    {
        gridsize:15
    }
    ]


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

    
    var displayDelay = 100;

    var displayfade = 800;
    var loadfadeout = 800;

    $scope.programInputChange = function () {

        $scope.programInput.update();

        react.push({
            name:"resetInput",
            state:{
                setInput:{
                    projectInput:$scope.programInput
                }
            }
        })

        $scope.getInput();

        events.dispatch("refreshenv");
        
    }

    var phases = [
    {
        message:"processing", 
        delay:0,
        duration:0,
        phase:function (complete) {

            console.log("processing phase");

            $scope.resetInput();

            $scope.resetInput({
                setInput:{
                    programInput:$scope.programInput
                }
            });


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

            // complete();


            api.instantiate($scope, function (res) {

                console.log("Instantiate session", res);

                $scope.session = res.data.session;

                api.setInput($scope, false, function (res) {

                    if (complete) complete() 

                });
                
            })

        }
    },
    {
        message:"initializing evolutionary algoirthm", 
        delay:600,
        duration:0,
        phase:function (complete) {

            console.log("initialize algorithm phase, input", $scope.getInput());
            
                
            api.initialize($scope, function (res) {

                console.log("Initialize algorithm", res);

                if (complete) complete();
            });

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

            display.load($scope.programInput);

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


                    u.toggle("show", "run", {fade:loadfadeout, delay:displayDelay});
                    u.toggle("show", "settings", {fade:loadfadeout, delay:displayDelay});

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