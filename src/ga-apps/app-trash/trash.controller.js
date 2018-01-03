app.controller("trash.controller", ['$scope', '$http', 'trash-sim', 'utility', 'global.service', 'react.service', 'events.service', "display.service", 'api.service', function ($scope, $http, simulator, u, g, react, events, display, api) {

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

    var processTypes = {
        recursive:"recursive",
        loop:"loop",
        async:"async",
        worker:"worker"
    }
    
    $scope.programInput = {
        goals:[{goal:"min"}, {goal:"max"}],
        grid:{
            size:5
        },
        trashPercent:50,
        processType:processTypes.recursive,
        getTotalSteps:function () {

            return $scope.programInput.grid.size*$scope.programInput.grid.size*2;
        },
        convertTrash:function (percentToRate) {

            return percentToRate ? $scope.programInput.trashPercent/100 : $scope.programInput.trashRate*100;
        }
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

    // var instantiate = api.instantiate();
    // var initialize = api.initialize();
    // var setInput = api.setInput();
    // var refreshEnvironment = api.refreshEnvironment();

    
    var displayDelay = 100;

    var displayfade = 800;
    var loadfadeout = 800;

    $scope.programInputChange = function () {

        // console.log("grid size", $scope.programInput.grid.size);

        $scope.programInput.update();

        react.push({
            name:"resetInput",
            state:$scope.programInput
        })

        react.push({
            name:"programInput" + self.name,
            state:$scope.programInput
        })

        // events.dispatch("refreshenv");

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

            complete();


            // api.instantiate(function (res) {

            //     console.log("Instantiate session", res);

            //     $scope.session = res.data.session;

            //     api.setInput($scope, false, function (res) {

            //         if (complete) complete() 

            //     });
                
            // })

        }
    },
    {
        message:"initializing evolutionary algoirthm", 
        delay:600,
        duration:0,
        phase:function (complete) {

            console.log("initialize algorithm phase, input", $scope.getInput());
            

            api.instantiate(function (res) {

                console.log("Instantiate session", res);

                $scope.session = res.data.session;
                
                api.initialize($scope, function () {

                    api.setInput($scope, false, function (res) {

                        if (complete) complete() 

                    });

                })
                
            })

                
            // api.initialize($scope, function (res) {

            //     console.log("Initialize algorithm", res);

            //     if (complete) complete();
            // });

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


                    u.toggle("enable", "refresh", {fade:loadfadeout, delay:displayDelay});

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