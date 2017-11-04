app.controller("recognize.controller", ['$scope', 'utility', 'react.service', 'events.service', 'simulators', '$http', function ($scope, u, react, events, simulators, $http) {

    var self = this;

    self.name = "recognize";
    $scope.name = self.name;

    // self.pdata = data.get(self.name);

    var simulator = simulators.get(self.name);

    var update = false;
    var ev = false;

    events.on("closerecognize", function () {

       $scope.running(false);
    });


    var displayfade = 800;
    var loadfadeout = 800;

    var setInputBackend = function () {

        $http({
            method:"POST",
            url:"/evolve/set", 
            data:{input:$scope.getInput()}, 
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


    var loadDataDatabase = function (data, index) {

        console.log("write image", index);


        $http({
            method:"POST",
            url:"/write/image", 
            data:{index:data[index].index, label:data[index].label, pixels:data[index].pixels}
        })
        .then(function (res) {

            console.log("Image written", index, res);

            setTimeout(function () {

                if (index + 1 < 28000) loadData(data, index + 1);
            }, 200)
            

        }, function (err) {

            if (err) console.log("Write image error", err.message);

            setTimeout(function () {

                if (index + 1 < 28000) loadData(data, index + 1);
            }, 200)
        })
        
    }

    var writeImagesDatabase = function () {

        imageprocessor.getImages(function (result) {

            loadData(result, 0);

        });

    }

    var displayDelay = 100;

    var phases = [
    {
        message:"processing", 
        delay:0,
        duration:0,
        phase:function (duration) {
            $scope.resetInput();

            $scope.resetInput({
                gens:20,
                runs:5,
                goal:"max",
                pop:20,
                evdelay:0
            });

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
        message:"load data", 
        delay:600,
        duration:0, 
        phase:function (duration) {


            

            // writeImagesDatabase();
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


                    u.toggle("show", "hud", {fade:duration});
                    u.toggle("show", "run", {fade:duration});
                    u.toggle("show", "refresh", {fade:duration});
                    u.toggle("show", "play", {fade:duration});
                    u.toggle("show", "settings", {fade:duration});
                    u.toggle("show", "hud", {delay:displayDelay});

                    u.toggle("enable", "hud");
                    u.toggle("enable", "run");

                }
            });

            events.dispatch("imageFunctions");
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

        // console.log("refresh");

        react.push({
            name:"indexes",
            state:{
                index:Math.floor(Math.random()*28000),
                sample:0
            }
        })

        simulator.reset();
        simulator.create();
    }

    self.play = function () {

        simulator.runBest($scope.evdata.best);
    }


    load();

}]);