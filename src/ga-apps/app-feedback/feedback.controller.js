app.controller("feedback.controller", ['$scope', 'feedback-sim', 'data', 'utility', 'send.service', 'events.service', 'react.service', 'display.service', 'input.service', 'api.service', 'config.service', 'evolve.service', function ($scope, simulator, data, u, send, events, react, display, $input, api, config, evolve) {

    var self = this;

    self.name = "feedback";
    $scope.name = self.name;

    // $scope.getContentUrl = function() {

    //     return "assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/feedback/feedback_demo.html";
    // }

    console.log("load controller", self.name);

    // var update = false;
    // var ev = false;

    events.on("close" + self.name, "id", function () {

        $scope.running(false);
    });

    console.log("subscribe in", self.name);


    react.subscribe({
        name:"ev.feedback",
        callback:function (x) {
            // console.log("set evdata trash", x);
            // evdata = x;

            self.step(x.best.dna);
        }

    });

    var processTypes = config.get("types.processTypes")

    $scope.programInput = config.get("global.feedback");


    react.subscribe({
        name:"sim." + self.name,
        callback:function (x) {
            self.sdata = x;
        }
    });


    var displayDelay = 100;

    var displayfade = 800;

    var phases = [
    {
        message:"processing", 
        delay:0,
        duration:0,
        phase:function (complete) {
            
            // $scope.resetInput();

            evolve.setup(self.name);


            $input.setInput({
                name:self.name,
                programInput:$scope.programInput
            })

            $scope.settings = $input.setSettings($scope, $input.getInput(false));



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
            
            console.log("load environment");

            simulator.create();
            simulator.reset();

            // events.dispatch("createPlot");
            // events.dispatch("resetPlot");

            if (complete) complete()

        }
    },
    {
        message:"load display", 
        delay:600,
        duration:displayfade,
        phase:function (complete) {
            
            u.toggle("show", "stage", {fade:300});
            u.toggle("show", "controls", {fade:300});
            u.toggle("show", "hud", {fade:300});
            u.toggle("show", "evolvedata", {fade:300});

            display.load(self.name);



            if (complete) complete();
        }
    },
    {
        message:"complete", 
        delay:600,
        duration:displayfade, 
        phase:function (complete) {
            
            $("#loadinginner").animate({opacity:0}, {
                duration:displayfade, 
                complete:function () {
                    
                    console.log("hide loading"); 
                    $("#loadinginner").parent().hide();
                    evolve.running(false);



                    u.toggle("hide", "loading", {fade:displayfade});                    
                    u.toggle("show", "hud", {fade:displayfade, delay:displayDelay});

                    u.toggle("show", "refresh", {fade:displayfade, delay:displayDelay});
                    u.toggle("show", "restart", {fade:displayfade, delay:displayDelay});
                    u.toggle("show", "step", {fade:displayfade, delay:displayDelay});
                    u.toggle("show", "play", {fade:displayfade, delay:displayDelay});
                    u.toggle("show", "stop", {fade:displayfade, delay:displayDelay});


                    u.toggle("enable", "play", {fade:displayfade, delay:displayDelay});
                    u.toggle("enable", "refresh", {fade:displayfade, delay:displayDelay});

                    // u.toggle("show", "run", {fade:displayfade, delay:displayDelay});
                    u.toggle("show", "settings", {fade:displayfade, delay:displayDelay});


                    if (complete) complete();
                
                }

            });
        }
    }
    ]


    self.refresh = function () {

        evolve.running(false);
        simulator.refresh();
        $scope.resetgen();
    }

    self.step = function (dna) {


        simulator.step(dna, 200);
    }

    self.play = function () {
        

        $scope.run();

    }

    self.stop = function () {


        $scope.breakRun();

    }


    
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