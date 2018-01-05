app.controller("feedback.controller", ['$scope', '$http', 'feedback-sim', 'data', 'utility', 'send.service', 'events.service', 'react.service', 'input.service', function ($scope, $http, simulator, data, u, send, events, react, $input) {

    var self = this;

    self.name = "feedback";
    $scope.name = self.name;

    // $scope.getContentUrl = function() {

    //     return "assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/feedback/feedback_demo.html";
    // }

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


    var displayfade = 800;
    var loadfadeout = 800;

    var phases = [
    {
        message:"processing", 
        delay:0,
        duration:0,
        phase:function (complete) {
            
            // $scope.resetInput();


            u.toggle("hide", "evolve");
            u.toggle("hide", "hud");

            u.toggle("hide", "run");



            u.toggle("hide", "settings");


            complete();

        }
    },
    {
        message:"initialize genetic algoirthm", 
        delay:600,
        duration:0,
        phase:function (complete) {



            console.log("initialize algorithm phase");
            
            api.instantiate(function (res) {

                console.log("Instantiate session", res);

                $scope.session = res.data.session;

                $input.setInput({
                    session:$scope.session
                })
                
                api.initialize($scope, function () {

                    api.setInput($scope, false, function (res) {

                        if (complete) complete() 

                    });

                })
                
            })


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
            u.toggle("show", "evolvedata", {fade:300});

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



                    u.toggle("hide", "loading", {fade:loadfadeout});                    
                    u.toggle("show", "hud", {fade:loadfadeout, delay:displayDelay});


                    u.toggle("show", "run", {fade:loadfadeout, delay:displayDelay});
                    u.toggle("show", "settings", {fade:loadfadeout, delay:displayDelay});

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


    load();


}]);