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

    var setInputBackend = function (complete) {

        console.log("set input");

        $http({
            method:"POST",
            url:"/evolve/set", 
            data:{input:$scope.getInput()}, 
        })
        .then(function (res) {

            console.log("set input response");

            if (complete) complete();

        }, function (err) {

            console.log("Server error while setting input", err.message);

        })

    }

    var initializeAlgorithmBackend = function (complete) {

        console.log("initialize evolutionary algorithm");

        $http({
            method:"POST",
            url:"/evolve/initialize", 
            data:{input:$scope.getInput()}
        })
        .then(function (res) {

            console.log("Initialize algorithm", res);

            if (complete) complete()

        }, function (err) {

            console.log("Server error while initializing algorithm", err.message);

        })

    }


    var instantiateBackend = function (complete) {

        console.log("instantiate session");

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
        phase:function (complete) {

            console.log("processing phase");


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

            
            $scope.getData(function ($d) {

                console.log("get data complete", $d);

                $scope.setData($d);
            })


        }
    },
    {
        message:"initializing evolutionary algoirthm", 
        delay:600,
        duration:0,
        phase:function (complete) {

            console.log("initialize phase, processing phase complete (should not appear before set input response)");

            instantiateBackend(function () {

                initializeAlgorithmBackend(function () {

                        setInputBackend(complete);
                    })
                });
                    

            

        }
    },
    {
        message:"loading data", 
        delay:600,
        duration:0, 
        phase:function (complete) {

            console.log("loading phase");

            // writeImagesDatabase();

            if (complete) complete();
        }
    },
    {
        message:"loading display", 
        delay:600,
        duration:displayfade,
        phase:function (complete) {

            console.log("loading display phase");

            // u.toggle("show", "hud", {fade:duration});
            // u.toggle("show", "run", {fade:duration});

            if (complete) complete();
        }
    },
    {
        message:"getting things ready", 
        delay:600,
        duration:loadfadeout, 
        phase:function (complete) {

            console.log("getting things ready phase");

            $("#loadinginner").animate({opacity:0}, {
                duration:loadfadeout, 
                complete:function () {
                    console.log("hide loading"); 
                    $("#loadinginner").parent().hide();
                    $scope.running(false);

                    u.toggle("enable", "hud");
                    u.toggle("enable", "run");
                    

                    u.toggle("show", "hud", {fade:loadfadeout});
                    u.toggle("show", "refresh", {fade:loadfadeout});
                    u.toggle("show", "play", {fade:loadfadeout});
                    u.toggle("show", "run", {fade:loadfadeout});
                    u.toggle("show", "settings", {fade:loadfadeout});


                    if (complete) complete();
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

        simulator.simulate($scope.session);
    }


    load();

}]);