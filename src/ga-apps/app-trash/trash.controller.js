app.controller("trash.controller", ['$scope', '$http', 'trash-sim', 'utility', 'react.service', 'events.service', function ($scope, $http, simulator, u, react, events) {

    var self = this;

    self.name = "trash";
    $scope.name = self.name;
    self.sdata;

    events.on("completeSim", function () {

        $scope.running(false);
    });

    react.subscribe({
        name:"sim." + self.name,
        callback:function (x) {
            self.sdata = x;
        }
    })

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

            $scope.resetInput();

            u.toggle("disable", "run", {delay:displayDelay});
            u.toggle("disable", "hud", {delay:displayDelay});
            u.toggle("disable", "settings", {delay:displayDelay});

            u.toggle("hide", "evolve", {delay:displayDelay});
            u.toggle("hide", "run", {delay:displayDelay});
            u.toggle("hide", "hud", {delay:displayDelay});
            u.toggle("hide", "play", {delay:displayDelay});
            u.toggle("hide", "refresh", {delay:displayDelay});
            u.toggle("hide", "restart", {delay:displayDelay});
            u.toggle("hide", "step", {delay:displayDelay});
            u.toggle("hide", "stop", {delay:displayDelay});
            u.toggle("hide", "break", {delay:displayDelay});
            u.toggle("hide", "settings", {delay:displayDelay});

            
            $scope.getData(function ($d) {

                console.log("get data complete", $d);

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

            if (complete) complete();
        }
    },
    {
        message:"getting things ready", 
        delay:600,
        duration:loadfadeout, 
        phase:function (complete) {
            $("#loadinginner").animate({opacity:0}, {
                duration:loadfadeout, 
                complete:function () {
                    console.log("hide loading"); 
                    $("#loadinginner").parent().hide();
                    $scope.running(false);


                    u.toggle("show", "hud", {fade:loadfadeout});
                    u.toggle("show", "settings", {fade:loadfadeout});
                    u.toggle("show", "run", {fade:loadfadeout});

                    u.toggle("enable", "hud");
                    u.toggle("enable", "run");
                    u.toggle("enable", "settings");

                    events.dispatch("load-evolve-data-display");
                    events.dispatch("load-trash-sim-display");
                    events.dispatch("load-controls-display");


                    if (complete) complete();
                }
            });
        }
    }
    ]

    react.push({
        name:"phases" + self.name,
        state:phases
    })

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