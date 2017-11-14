app.controller("feedback.controller", ['$scope', '$http', 'feedback-sim', 'data', 'utility', 'send.service', 'events.service', 'react.service', function ($scope, $http, simulator, data, u, send, events, react) {

    var self = this;

    self.name = "feedback";
    $scope.name = self.name;

    $scope.getContentUrl = function() {

        return "assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/feedback/feedback_demo.html";
    }

    console.log("load controller", self.name);

    var update = false;
    var ev = false;

    events.on("close" + self.name, "id", function () {

        $scope.running(false);
    });

    console.log("subscribe in", self.name);


    react.subscribe({
        name:"sim." + self.name,
        callback:function (x) {
            self.sdata = x;
        }
    });


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


    var displayfade = 800;
    var loadfadeout = 800;

    var phases = [
    {
        message:"processing", 
        delay:0,
        duration:0,
        phase:function (complete) {
            
            $scope.resetInput();


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
        message:"initialize genetic algoirthm", 
        delay:600,
        duration:0,
        phase:function (complete) {
            u.toggle("hide", "evolve");
            u.toggle("hide", "refresh");
            u.toggle("hide", "restart");
            u.toggle("hide", "step");
            u.toggle("hide", "play");
            u.toggle("hide", "stop");
            u.toggle("hide", "break");

            console.log("initialize algorithm phase");
            
            initializeAlgorithmBackend(function () {

                if (complete) complete();
            });

        }
    },
    {
        message:"load environment", 
        delay:600,
        duration:0, 
        phase:function (complete) {
            // simulator.create();

            if (complete) complete()

        }
    },
    {
        message:"load display", 
        delay:600,
        duration:displayfade,
        phase:function (complete) {
            
            u.toggle("show", "hud", {fade:displayfade});

            if (complete) complete();
        }
    },
    {
        message:"complete", 
        delay:600,
        duration:loadfadeout, 
        phase:function (complete) {
            
            $("#loadinginner").animate({opacity:0}, {
                duration:loadfadeout, 
                complete:function () {
                    
                    console.log("hide loading"); 
                    $("#loadinginner").parent().hide();
                    $scope.running(false);
                
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


    load();


}]);