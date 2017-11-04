app.controller("trash.controller", ['$scope', '$http', 'trash-sim', 'utility', 'react.service', 'events.service', function ($scope, $http, simulator, u, react, events) {

    var self = this;

    self.name = "trash";
    $scope.name = self.name;


    events.on("completeSim", function () {

        $scope.running(false);
    });

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

    var initializeEnvironmentBackend = function () {

        $http({
            method:"GET",
            url:"/trash/environment/create"
        })
        .then(function (res) {

            console.log("Initialize environment");

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

            setInputBackend();
        }
    },
    {
        message:"initialize genetic algoirthm", 
        delay:600,
        duration:0,
        phase:function (duration) {

            

            initializeAlgorithmBackend();
        }
    },
    {
        message:"load environment", 
        delay:600,
        duration:0, 
        phase:function (duration) {

            initializeEnvironmentBackend();

            events.dispatch("refreshenv");
        }
    },
    {
        message:"load display", 
        delay:600,
        duration:displayfade,
        phase:function (duration) {


        }
    },
    {
        message:"complete", 
        delay:600,
        duration:loadfadeout, 
        phase:function (duration) {
            $("#loadinginner").animate({opacity:0}, {
                duration:duration, 
                complete:function () {
                    console.log("hide loading"); 
                    $("#loadinginner").parent().hide();
                    $scope.running(false);

                    u.toggle("enable", "hud");
                    u.toggle("enable", "run");
                    u.toggle("enable", "settings");


                    u.toggle("show", "play", {fade:duration});
                    u.toggle("show", "refresh", {fade:duration});
                    u.toggle("show", "settings", {fade:duration});
                    u.toggle("show", "hud", {fade:duration});
                    u.toggle("show", "run", {fade:duration});
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
        simulator.refresh();
    }

    self.restart = function () {

        
        $scope.running(false);
        simulator.reset();
    }

    self.step = function () {

        $scope.running(true);
        simulator.step();
    }

    self.play = function () {
        
        $scope.running(true);
        simulator.play(false);
    }

    self.stop = function () {

        $scope.running(false);
        simulator.stop();  
    }


    load();


}]);