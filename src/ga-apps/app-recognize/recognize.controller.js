app.controller("recognize.controller", ['$scope', 'utility', 'react.service', 'events.service', 'recognize-sim', 'api.service', 'input.service', 'evolve.service', 'display.service', 'config.service', 'loading.service', function ($scope, u, react, events, simulator, api, $input, evolve, display, config, loading) {

    var self = this;

    
    self.name = "recognize";
    $scope.name = self.name;
    

    var processTypes;

    var displayParams = display.getParams();

    $scope.programInput;


    var pageBuilt = display.beenBuilt(self.name);


    console.log("\n\n\ncontroller", self.name, "built", pageBuilt, "\n\n\n")


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


    var phases = [
    {
        message:"processing", 
        delay:300,
        duration:600,
        phase:function (options) {

            console.log("processing phase");


            enter();


            display.elementsToggle(self.name, "hide");


            setTimeout(function () {

                if (typeof options.complete === "function") options.complete() 
            }, options.duration)


        }
    },
    {
        message:"initializing evolutionary algoirthm", 
        delay:300,
        duration:600,
        phase:function (options) {

            console.log("initialize phase, processing phase complete (should not appear before set input response)");


            if (!pageBuilt) {
               
                api.instantiate(function (res) {

                    console.log("Instantiate session", res);

                    $scope.session = res.data.session;

                    $input.setInput({
                        session:$scope.session
                    })
                    
                    api.initialize(function () {

                        api.setInput(false, function (res) {

                            setTimeout(function () {

                                if (typeof options.complete === "function") options.complete() 
                            }, options.duration)

                        });

                    })
                    
                })
            }
            else {

                $scope.resetgen();


                setTimeout(function () {

                    if (typeof options.complete === "function") options.complete() 
                }, options.duration)

            }

        }
    },
    {
        message:"loading data", 
        delay:300,
        duration:displayParams.fade, 
        phase:function (options) {

            console.log("loading phase");

            // writeImagesDatabase();

            setTimeout(function () {

                if (typeof options.complete === "function") options.complete() 
            }, options.duration)
        }
    },
    {
        message:"loading display", 
        delay:300,
        duration:displayParams.fade,
        phase:function (options) {

            console.log("loading display phase");

            display.load(self.name);

            setTimeout(function () {

                if (typeof options.complete === "function") options.complete() 
            }, options.duration)
        }
    },
    {
        message:"getting things ready", 
        delay:300,
        duration:displayParams.fade, 
        phase:function (options) {

            console.log("getting things ready phase");

            
            evolve.running(false, $scope);


            u.toggle("hide", "loading", {fade:displayParams.fade, delay:displayParams.delay});

            display.elementsToggle(self.name, "show");


            events.dispatch("imageFunctions");


            display.isBuilt(self.name);

            setTimeout(function () {

                if (typeof options.complete === "function") options.complete() 
            }, options.duration)

        }
    }
    ]
    

    var load = function () {


        display.waitForElem({elems:"#loadingtoggle"}, function (options) {

            console.log("load controller", self.name);

            loading.init($scope, phases);

            u.toggle("show", "loading", {fade:displayParams.fade});

            loading.runPhase(0);
        })
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
        // simulator.simulate();
    }

    self.play = function () {

        simulator.simulate();
    }


    var build = function () {

        
        processTypes = config.get("types.processTypes")

        $scope.programInput = config.get("global.feedback");

    }


    var enter = function () {


        console.log("enter controller", self.name);


        if (!pageBuilt) {

            $input.createInput(self.name);

        }
        else {

            $input.setName(self.name);

        }

        evolve.setup(self.name);


        $input.setInput({
            name:self.name,
            gens:20,
            runs:5,
            pop:20
        });

        $scope.settings = $input.setSettings($scope, $input.getInput(false));

    }



    build();

    load();

   


}]);