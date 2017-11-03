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
    

    var displayfade = 800;
    var loadfadeout = 800;

    var phases = [
    {
        message:"processing", 
        delay:0,
        duration:0,
        phase:function () {

            $scope.resetInput();

            setInputBackend();
        }
    },
    {
        message:"initialize genetic algoirthm", 
        delay:600,
        duration:0,
        phase:function () {

            u.toggle("disable", "hud");
            u.toggle("disable", "run");
            u.toggle("hide", "evolve");
            u.toggle("hide", "refresh");
            u.toggle("hide", "restart");
            u.toggle("hide", "step");
            u.toggle("hide", "play");
            u.toggle("hide", "stop");
            u.toggle("hide", "break");

            initializeAlgorithmBackend();
        }
    },
    {
        message:"load environment", 
        delay:600,
        duration:0, 
        phase:function () {

            initializeEnvironmentBackend();

            events.dispatch("refreshenv");
        }
    },
    {
        message:"load display", 
        delay:600,
        duration:displayfade,
        phase:function (duration) {

            u.toggle("show", "hud", {fade:duration});
            u.toggle("show", "run", {fade:duration});
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