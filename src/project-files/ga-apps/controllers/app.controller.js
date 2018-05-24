app.controller("app.controller", ['$scope', 'simulators', 'controllers', 'states', 'utility', "display.service", 'api.service', 'input.service', 'config.service', 'evolve.service', 'loading.service', function ($scope, simulators, controllers, states, u, display, api, $input, config, evolve, loading) {

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


    var tempcross = config.get("types.crossoverMethods");
    var k = 0;

    var crossoverMethods = [];

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

            console.log("initializing algorithm");
            
            if (!pageBuilt) {
               
                api.instantiate(function (res) {

                    // console.log("Instantiate session", res);

                    $scope.session = res.data.session;

                    // console.log("instantiate complete");

                    $input.setInput({
                        session:$scope.session,
                        method:tempcross.default
                    })
                    
                    api.initialize(function () {

                        api.setInput(false, function (res) {

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




    /* 
    #_______________________________________
    #
    #
    #   Settings kind support functions
    #
    #
    #_________________________________________
    */


    var kindStatus = {
        opened:"z-80",
        closed:"z-60"
    }

    var kinds = [
    {
        id:0,
        value:"basic",
        status:true
    },
    {
        id:1,
        value:"advanced",
        status:false
    }
    ]

    var tabParams = {
        opened:{
            top:0,
            opacity:0,
            zIndex:20,
            class:kindStatus.opened
        },
        closed:{
            top:"20px",
            opacity:1,
            zIndex:10,
            class:kindStatus.closed
        }
    }

    var toggleKind = kinds[0];

    var toggleKindType = function (kindValue) {

        toggleKind = kinds.find(function (p) {

            return p.value == kindValue;
        });


        kinds = kinds.map(function (value, index) {

            if (value.value == toggleKind.value) {

                // sets toggle kind status to true (indicates that kindValue tab has been selected opened)

                value.status = true;
            }
            else {

                // indicates all other tabs closed

                value.status = false;
            }

            return value;

        })

        return toggleKind;
    }

    var getTabParam = function (kind, param) {

        return kind.status ? tabParams.opened[param] : tabParams.closed[param];
    }

    var tabElem = function (kind) {
        
        return {
            main:$("#" + kind.value + "-tab"),
            cover:$("#settings-" + kind.value + "-cover"),
            settings:$("#settings-" + kind.value),
            closedSign:$("settings-" + kind.value + "-inactive-cover")
        }
    }

    var toggleTab = function (kind) {


        tabElem(kind).main.css({
            top:getTabParam(kind, "top"),
            zIndex:getTabParam(kind, "zIndex")
        });

        tabElem(kind).cover.css({
            // top:getTabParam(kind, "top"), 
            opacity:getTabParam(kind, "opacity")
        });

        tabElem(kind).settings
        .removeClass(kind.status ? tabParams.closed.class : tabParams.opened.class)
        .addClass(getTabParam(kind, "class"));

    }



    /*_____________________________________________________________________________*/




   /* 
    #_______________________________________
    #
    #
    #   Settings open/close toggle support functions
    #
    #
    #_________________________________________
    */



    var controls = [
    {
        name:"open",
        input:"#opensettings",
        tool:"#opentool"
    }
    ]

    var inputs = [
    {
        input:"#gensinput"
    },
    {
        input:"#runsinput"
    },
    {
        input:"#goalinput"
    },
    {
        input:"#popinput"
    },
    {
        input:"#refreshbtn"
    }
    ]

    $stage = $("#stage");


    var setHover = function (i) {

        controls.forEach(function(value, index) {

            $(value.input).hover(
                function() {
                    $(value.tool).animate({opacity:1}, 100);
                },
                function () {
                    $(value.tool).animate({opacity:0}, 100);
                }
            );

        })
    }

    // setHover();

    var isFocus = function () {

       
        for (var i in inputs) {
            

            if ($(inputs[i].input).is(":focus")) {
                return true;
            }

        }
               
        return false;
    }

    var settingsWidth = 800;
    var width = 0.6;
    var toggleOpened = true;
    var openStatus = {opened:false, right:{opened:-20, closed:(-1)*settingsWidth}};
            


    var animateToggle = function (open_up) {

        $(controls[0].tool).animate({opacity:0}, 200);
        $("#settingstoggle").animate({
            
            right:
            
            (
             (!open_up || openStatus.opened) 
             ? openStatus.right.closed

             : (
                (open_up || openStatus.closed) 
                ? openStatus.right.opened 
                : openStatus.right.closed
                )
             )

        }, 
        {
            
            duration:300, 
            complete:function () {
                openStatus.opened = !openStatus.opened;
            }

        });

    }


    self.animateRefresh = function (complete) {

        toggleOpened = false;
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
                toggleOpened = true;
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

        console.log("open settings ", openStatus.opened);

        if (!isFocus() && toggleOpened) {
            animateToggle(true);
        }
    }


    self.changeKind = function (kindValue) {

        console.log("change settings kind", kindValue);

        kinds.map(function (value, index) {

            toggleKindType(kindValue)

            toggleTab(value);

        });

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

                animateToggle(false);
            });

        }, 500);


        controller.enter(self, $scope);

        setHover();
        
        // evolve.breakRun();

    }



    build();

    load();



    /*___________________________________________________________________________________*/








}]);