app.controller("trash.controller", ['$scope', '$http', 'trash-sim', 'utility', 'global.service', 'react.service', 'events.service', "display.service", function ($scope, $http, simulator, u, g, react, events, display) {

    var self = this;

    self.name = "trash";
    $scope.name = self.name;
    self.sdata;

    // console.log("\n@@@@@@@@@@@@@\nenter trash controller\n\n");


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

    var setInputBackend = function (complete) {

        $http({
            method:"POST",
            url:"/evolve/set",
            data:{input:$scope.getInput()}
        })
        .then(function (res) {

            console.log("Set input", res);

            if (complete) complete();

        }, function (err) {

            console.log("Server error while setting input", err.message);

        })

    }

    var initializeAlgorithmBackend = function (complete) {


        $http({
            method:"POST",
            url:"/evolve/initialize",
            data:{input:$scope.getInput()}
        })
        .then(function (res) {

            console.log("Initialize algorithm", res);

            if (complete) complete();

        }, function (err) {

            console.log("Server error while initializing algorithm", err.message);

        })

    }

    var instantiateBackend = function (complete) {


        $http({
            method:"GET",
            url:"/evolve/instantiate"
        })
        .then(function (res) {

            console.log("Instantiate", res);

            $scope.session = res.data.session;

            if (complete) complete();

        }, function (err) {

            console.log("Server error while initializing algorithm", err.message);

        })

    }

    var refreshEnvironment = function (complete) {


        $http({
            method:"GET",
            url:"/trash/environment/refresh/" + $scope.session
        })
        .then(function (res) {

            console.log("Refresh environment", res);

            react.push({
                name:"create.env",
                state:res.data.env
            })

            if (complete) complete();

        }, function (err) {

            console.log("Server error while initializing algorithm", err.message);

        })

    }

    
    var displayDelay = 100;

    var displayfade = 800;
    var loadfadeout = 800;

    var phases = [
    {
        message:"processing", 
        delay:0,
        duration:0,
        phase:function (complete) {

            console.log("processing phase");

            $scope.resetInput();


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


            $scope.getData(function ($d) {

                // console.log("get data complete", $d);

                $scope.setData($d);

                instantiateBackend(function () {

                    setInputBackend(complete);
                })
            })


        }
    },
    {
        message:"initializing evolutionary algoirthm", 
        delay:600,
        duration:0,
        phase:function (complete) {

            console.log("initialize algorithm phase");
            
            initializeAlgorithmBackend(function () {

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

            refreshEnvironment(function () {

                if (complete) complete();
            });

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

            display.load();

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
                    // $("#loadinginner").parent().hide();
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

                    

                    // console.log("loading hidden, show display\n", loadResult, "\nready to evolve");

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