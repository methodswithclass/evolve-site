app.controller("app.controller", ['$scope', "asset.service", 'states', 'utility', "display.service", 'api.service', 'input.service', 'config.service', 'evolve.service', 'loading.service', 'settings.service', function ($scope, assets, states, u, display, api, $input, config, evolve, loading, settings) {

    var self = this;



    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;

    

    self.name = states.getName();
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
    var displayParams;
    var allParams;
    var loadSpeeds;
    var k = 0;

    $scope.navName = "back";
    $scope.navLoc = states.getName();

    // $scope.demos = [
    // {
    //     name:"trash pickup",
    //     state:"trash#demo"
    // },
    // {
    //     name:"feedback",
    //     state:"feedback#demo"
    // }
    // ]

    $scope.demos = [];

    $scope.demoModel;

    $scope.changeDemo = function (model) {

        // var value = $("#demoSelect option:selected").text();
        var value = model;

        console.log("value", value);

        var newDemo = $scope.demos.find(function (p) {

            // console.log("state", p.state, states.current());
            return p.name == value;
        })

        states.go(newDemo.state);

    }


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


    console.log("loading", self.name, "controller");


    var simulator = assets.get(assets.types.SIMULATOR, self.name);
    var controller = assets.get(assets.types.CONTROLLER, self.name);
    var pageBuilt = display.beenBuilt(self.name);



    react.push({
        name:"simulator" + self.name,
        state:simulator
    })

    react.subscribe({
        name:"data" + self.name,
        callback:function (x) {

            $scope.evdata = x.evdata || $scope.evdata;
            $scope.stepdata = x.stepdata || $scope.stepdata;
            $scope.input = x.input || $scope.input;
        }
    })


    react.subscribe({
        name:"displayParams",
        callback:function (x) {

            displayParams = x.params;
            loadSpeeds = x.loadSpeeds;
            allParams = x.allParams;
        }
    })


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

            console.log("initializing algorithm, page built", pageBuilt);
            

            if (!pageBuilt) {
               
                api.instantiate(function (res) {

                    // console.log("Instantiate session", res);

                    $scope.session = res.data.session;

                    // console.log("instantiate complete");

                    $input.setInput({
                        session:$scope.session,
                        method:tempcross.default
                    })
                    
                    api.setInput(false, function (res) {

                        api.initialize(function () {                        


                            $scope.session = res.data.session;

                            // console.log("instantiate complete");

                            $input.setInput({
                                session:$scope.session
                            });

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

            settings.animateToggle(false);

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

            // controller.createEnvironment(self, $scope);

            controller.finish(self, $scope)
            .then(function (result) {

                evolve.running(false, $scope);

                u.toggle("hide", "loading", {fade:displayParams.fade, delay:displayParams.delay});

                display.elementsToggle(self.name, "show");

                display.isBuilt(self.name);
            
                next(options);

            });
            
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

        settings.animateToggle();
    }


    self.changeKind = function (kindValue) {

        console.log("change settings kind", kindValue);

        settings.changeKind(kindValue);

    }


    self.changeInput = function () {

        $scope.settings = $input.changeInput($scope);


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


    var buttonParams = {
        delay:200,
        fade:400
    }

    
    self.refresh = function () {

        u.toggle("hide", "refresh");
        u.toggle("show", "refresh", {delay:buttonParams.delay, fade:buttonParams.fade});

        controller.refresh(self, $scope)
    }

    self.restart = function () {

        console.log("restart simulation");

        u.toggle("hide", "restart");
        u.toggle("show", "restart", {delay:buttonParams.delay, fade:buttonParams.fade});
        
        controller.restart(self, $scope);
    }

    self.step = function () {

        // variable depending on step speed
        // u.toggle("hide", "stop");
        // u.toggle("show", "stop", {delay:600});

        controller.step(self, $scope);
    }

    self.play = function () {

        u.toggle("hide", "play");
        u.toggle("show", "play", {delay:buttonParams.delay, fade:buttonParams.fade});
        
        controller.play(self, $scope);
    }

    self.stop = function () {

        u.toggle("hide", "stop");
        u.toggle("show", "stop", {delay:buttonParams.delay, fade:buttonParams.fade});

        controller.stop(self, $scope);
    }

    self.resetgen = function  () {
        
        u.toggle("hide", "refreshbtn");
        u.toggle("show", "refreshbtn", {delay:buttonParams.delay, fade:buttonParams.fade});

        u.toggle("show", "refreshfeedback", {fade:800});
        u.toggle("hide", "refreshfeedback", {delay:2000, fade:800});

        evolve.resetgen(true, function () {

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


    $scope.refresh = function () {

        self.refresh();
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
        
       
        g.waitForElem({elems:"#main-back"}, function (options) {
            
            $(options.elems).click(function () {

                settings.animateToggle(false);
            });

        });


        settings.setHover();

        controller.enter(self, $scope, function (name) {


            $input.setName(name);

            $input.setOverride(name, function () {

                g.waitForElem({elems:"#"+name+"efinfotoggle"}, function () {
                    evolve.stepprogress(name);
                });
            });

        });

    }



    config.get([
        "global.types.crossoverMethods",
        "global.programs",
        "config.activePages"
    ])
    .then(function (data) {


        tempcross = data[0];
        var programs = data[1];
        var activePages = data[2];

        console.log("tempcross", tempcross);

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

        var j = 0;

        $scope.demos = [];

        for (var i in programs) {
            if (activePages[i]) {
                $scope.demos[j++] = {
                    name:programs[i].meta.name,
                    state:i+"#demo"
                }
            }
        }

        var initialDemo = $scope.demos.find(function (p) {

            console.log("state", p.state, states.current());
            return p.state == states.current();
        })

        $scope.demoModel = initialDemo.name;


        build();

        load();


    })


    



    /*___________________________________________________________________________________*/








}]);