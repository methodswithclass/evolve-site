app.controller("app.controller", ['$scope', 'simulators', 'controllers', 'states', 'utility', "display.service", 'api.service', 'input.service', 'config.service', 'evolve.service', 'loading.service', 'settings.service', function ($scope, simulators, controllers, states, u, display, api, $input, config, evolve, loading, settings) {

    var self = this;



    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;


    // var observable = window.reactCustom;


    self.name = u.stateName(states.current());
    $scope.name = self.name;
    self.sdata;

    $scope.crossoverData = {};

    $scope.settings = {};
    $scope.grids = [];
    $scope.programInput = {};


    $scope.evdata = {}
    $scope.stepdata = {};
    $scope.input = {};


    var tempcross;
    var crossoverMethods = [];

    config.get("types.crossoverMethods")
    .then((data) => {


        tempcross = data;


        for (var i in tempcross) {

            if (k > 0) {

                crossoverMethods.push({
                    index:k-1,
                    name:i,
                    method:tempcross[i]
                })
            }

            k++;
        }

        $scope.crossoverMethods = crossoverMethods;
        $scope.settings.method = crossoverMethods[0].method;

        $scope.crossoverData = {
            crossoverMethods:crossoverMethods,
            method:crossoverMethods[0].method
        }


    })


    var k = 0;


    // $scope.settings.method = $scope.crossoverMethods[0].method;

    // console.log("\n\nmodel $scope.settings.method", $scope.settings.method);


    var initData = function () {


        $scope.evdata = {
            index:0,
            best:{},
            worst:{}
        }

        $scope.stepdata = {
            gen:0,
            org:0,
            run:0,
            step:0
        };

    }

    initData();

    var processTypes;
    var displayParams;
    var allParams;
    var loadSpeeds;


    react.subscribe({
        name:"data" + self.name,
        callback:function (x) {

            $scope.evdata = x.evdata || $scope.evdata;
            $scope.stepdata = x.stepdata || $scope.stepdata;
            $scope.input = x.input || $scope.input;
        }
    })

    // console.log("setup receiver for display params");

    react.subscribe({
        name:"displayParams",
        callback:function (x) {

            displayParams = x.params;
            loadSpeeds = x.loadSpeeds;
            allParams = x.allParams;
        }
    })


    console.log("loading", self.name, "controller");

    var simulator = simulators.get(self.name);
    var controller = controllers.get(self.name);

    var pageBuilt = display.beenBuilt(self.name);


    var next = function (options) {


        setTimeout(function () {

            if (typeof options.complete === "function") options.complete() 
        }, options.duration)
    }





    /* 
    #_______________________________________
    #
    #
    #   Phase data array
    #
    #
    #_________________________________________
    */




    var phases = [
    {
        message:"begin loading environment for demo", 
        delay:displayParams.delay,
        duration:2*displayParams.duration,
        phase:function (options) {

            console.log("initial processing phase");


            controller.setup(self, $scope);

            enter();

            display.elementsToggle(self.name, "hide");

            next(options);

        }
    },
    {
        message:"initializing algoirthm", 
        delay:displayParams.delay,
        duration:6*displayParams.duration,
        phase:function (options) {

            console.log("initializing algorithm", pageBuilt);
            

            console.log("input", $input.getInput())

            if (!pageBuilt) {
               
                api.instantiate(function (res) {

                    // console.log("Instantiate session", res);

                    $scope.session = res.data.session;

                    // console.log("instantiate complete");

                    $input.setInput({
                        session:$scope.session,
                        method:tempcross.default
                    })
                    
                    api.setInput(true, function (res) {

                        api.initialize(function () {                        

                            next(options);

                        });

                    })
                    
                })

            }
            else {

                self.resetgen();


                next(options);
            }

        }
    },
    {
        message:"loading environment", 
        delay:displayParams.delay,
        duration:6*displayParams.duration, 
        phase:function (options) {

            console.log("loading environment");

            
            controller.createEnvironment(self, $scope);


            next(options);

        }
    },
    {
        message:"loading display", 
        delay:displayParams.delay,
        duration:2*displayParams.duration,
        phase:function (options) {

            console.log("loading display");

            display.load(self.name);

            next(options);
        }
    },
    {
        message:"finishing up", 
        delay:displayParams.delay,
        duration:2*displayParams.duration, 
        phase:function (options) {

            console.log("finishing up");


            evolve.running(false, $scope);

            u.toggle("hide", "loading", {fade:displayParams.fade, delay:displayParams.delay});

            display.elementsToggle(self.name, "show");

            controller.finish(self, $scope);

            display.isBuilt(self.name);
            
            
            next(options);
            
        }
    }
    ]


    var load = function () {

        g.waitForElem({elems:"#loadingtoggle"}, function (options) {

            loading.init($scope, phases);

            console.log("begin loading environment for demo")

            u.toggle("show", "loading", {
                fade:displayParams.fade,
                complete:function () {

                    loading.runPhase(0);
                }
            });
        })
    }



    /*__________________________________________________________________________*/




    


    self.animateRefresh = function (complete) {

        settings.toggleOpened = false;
        $("#refreshfeedback").css({opacity:1});
        $("#refreshfeedback").animate(
        {
            top:0, 
            opacity:0
        }, 
        {
            duration:1000, 
            complete:function () { 
                $("#refreshfeedback").css({top:g.isMobile() ? 60 : 20});
                if (complete) complete();
                settings.toggleOpened = true;
            }
        }
        )
    }



    /*_______________________________________________________________________________*/





    /* 
    #_______________________________________
    #
    #
    #   Settings functions
    #
    #
    #_________________________________________
    */





    self.open = function () {

        // console.log("open settings ", openStatus.opened);

        if (!settings.isFocus() && settings.toggleOpened) {
            settings.animateToggle(true);
        }
    }


    self.changeKind = function (kindValue) {

        console.log("change settings kind", kindValue);

        settings.changeKind(kindValue);

    }


    self.changeInput = function () {

        $scope.settings = $input.changeInput()


        console.log("change input", $scope.settings);

    }


    /*________________________________________________________________________________*/






    /* 
    #_______________________________________
    #
    #
    #   Control functions
    #
    #
    #_________________________________________
    */


    
    self.refresh = function () {

        controller.refresh(self, $scope)
    }

    self.restart = function () {

        
        controller.restart(self, $scope);
    }

    self.step = function () {

        controller.step(self, $scope);
    }

    self.play = function () {
        
        controller.play(self, $scope);
    }

    self.stop = function () {

        controller.stop(self, $scope);
    }

    self.resetgen = function  () {
        
        u.toggle("show", "refreshfeedback", {fade:800});
        u.toggle("hide", "refreshfeedback", {delay:2000, fade:800});

        evolve.resetgen(function () {

            $scope.stepdata = {}
            $scope.evdata = {};
        });
    }

    self.run = function () {

        controller.run(self, $scope);
    }


    self.breakRun = function () {

        controller.breakRun(self, $scope);
    }



    /*________________________________________________________________________________*/






    /* 
    #_______________________________________
    #
    #
    #   Controller build and load functions
    #
    #
    #_________________________________________
    */


    var build = function () {

        controller.build(self, $scope);
    }



    var enter = function () {

        setTimeout(function () {

            $("#main-back").click(function () {

                settings.animateToggle(false);
            });

        }, 500);


        controller.enter(self, $scope);

        settings.setHover();
        
        // evolve.breakRun();

    }



    build();

    load();



    /*___________________________________________________________________________________*/








}]);