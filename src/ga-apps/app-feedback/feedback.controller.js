app.controller("feedback.controller", ['$scope', 'feedback-sim', 'data', 'utility', 'send.service', 'events.service', 'react.service', function ($scope, simulator, data, u, send, events, react) {

    var self = this;

    self.name = "feedback";
    $scope.name = self.name;


    $scope.getContentUrl = function() {
    
        var view;

        if (g.isMobile()) {

            view = "assets/views/mobile/ga-apps/feedback/feedback_demo.html";
        }
        else {
            view = "assets/views/desktop/ga-apps/feedback/feedback_demo.html";
        }

        return view;
    }

    console.log("load controller", self.name);

    var update = false;
    var ev = false;

    events.on("close" + self.name, function () {

        $scope.running(false);
    });

    console.log("subscribe in", self.name);


    react.subscribe({
        name:"sim." + self.name,
        callback:function (x) {
            self.sdata = x;
        }
    });


     var setInput = function () {

        $http({
            method:"POST",
            url:"/evolve/set", 
            data:{input:$scope.getInput()}, 
        })
        .then(function (res) {

            console.log("Set input", res);

        }, function (err) {

            console.log("Server error while setting input", err);

        })

    }

    var initializeAlgorithm = function () {


        $http({
            method:"POST",
            url:"/evolve/initialize", 
            data:{input:$scope.getInput()}
        })
        .then(function (res) {

            console.log("Initialize algorithm", res);

        }, function (err) {

            console.log("Server error while initializing algorithm", err);

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


            setInput();
        }
    },
    {
        message:"initialize genetic algoirthm", 
        delay:600,
        duration:0,
        phase:function () {
            u.toggle("hide", "evolve");
            u.toggle("hide", "refresh");
            u.toggle("hide", "restart");
            u.toggle("hide", "step");
            u.toggle("hide", "play");
            u.toggle("hide", "stop");
            u.toggle("hide", "break");

            initializeAlgorithm();
        }
    },
    {
        message:"load environment", 
        delay:600,
        duration:0, 
        phase:function () {
            // simulator.create();
        }
    },
    {
        message:"load display", 
        delay:600,
        duration:displayfade,
        phase:function (duration) {
            u.toggle("show", "hud", {fade:duration});
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