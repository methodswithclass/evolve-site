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

    var setInputBackend = function () {

        $http({
            method:"POST",
            url:"/evolve/set",
            data:{input:$scope.getInput()}
        })
        .then(function (res) {

            console.log("Set input", res);

        }, function (err) {

            console.log("Server error while setting input", err.message);

        })

    }

    var initializeAlgorithmBackend = function () {


        $http({
            method:"POST",
            url:"/evolve/initialize",
            data:{input:$scope.getInput()}
        })
        .then(function (res) {

            console.log("Initialize algorithm", res);

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

    // var initializeEnvironmentBackend = function () {

    //     $http({
    //         method:"GET",
    //         url:"/trash/environment/create"
    //     })
    //     .then(function (res) {

    //         console.log("Initialize environment");

    //         react.push({
    //             name:"create.env",
    //             state:res.data.env
    //         })

    //         // events.dispatch("refreshenv");

    //     }, function (err) {

    //         console.log("Server error while initializing algorithm", err.message);

    //     })

    // }
    
    var displayDelay = 100;

    var displayfade = 800;
    var loadfadeout = 800;

    var phases = [
    {
        message:"processing", 
        delay:0,
        duration:0,
        phase:function (duration) {

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

            
            instantiateBackend(function () {

                setInputBackend();
            })


        }
    },
    {
        message:"initializing evolutionary algoirthm", 
        delay:600,
        duration:0,
        phase:function (duration) {

            

            initializeAlgorithmBackend();
        }
    },
    {
        message:"loading environment", 
        delay:600,
        duration:0, 
        phase:function (duration) {

            // initializeEnvironmentBackend();

        }
    },
    {
        message:"loading display", 
        delay:600,
        duration:displayfade,
        phase:function (duration) {


        }
    },
    {
        message:"getting things ready", 
        delay:600,
        duration:loadfadeout, 
        phase:function (duration) {
            $("#loadinginner").animate({opacity:0}, {
                duration:duration, 
                complete:function () {
                    console.log("hide loading"); 
                    $("#loadinginner").parent().hide();
                    $scope.running(false);


                    u.toggle("show", "hud", {fade:duration});
                    u.toggle("show", "play", {fade:duration});
                    u.toggle("show", "refresh", {fade:duration});
                    u.toggle("show", "settings", {fade:duration});
                    u.toggle("show", "run", {fade:duration});

                    u.toggle("enable", "hud");
                    u.toggle("enable", "run");
                    u.toggle("enable", "settings");
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
        simulator.refresh($scop.session);
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