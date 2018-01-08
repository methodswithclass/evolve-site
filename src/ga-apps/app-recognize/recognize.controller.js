app.controller("recognize.controller", ['$scope', 'utility', 'react.service', 'events.service', 'recognize-sim', 'api.service', 'input.service', 'evolve.service', 'display.service', 'config.service',  function ($scope, u, react, events, simulator, api, $input, evolve, display, config) {

    var self = this;

    
    self.name = "recognize";
    $scope.name = self.name;
    

    var processTypes;

    $scope.programInput;


    var pageBuilt = display.beenBuilt(self.name);


    console.log("page built", self.name, pageBuilt, "\n\n\n\n\n\n\n\n")


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
        delay:0,
        duration:0,
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
        delay:600,
        duration:0,
        phase:function (options) {

            console.log("initialize phase, processing phase complete (should not appear before set input response)");


            if (!pageBuilt) {
               
                api.instantiate(function (res) {

                    console.log("Instantiate session", res);

                    $scope.session = res.data.session;
                    
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

                api.initialize(function () {

                    api.setInput(false, function (res) {

                        setTimeout(function () {

                            if (typeof options.complete === "function") options.complete() 
                        }, options.duration)

                    });

                })
            }

        }
    },
    {
        message:"loading data", 
        delay:600,
        duration:0, 
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
        delay:600,
        duration:displayfade,
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
        delay:600,
        duration:loadfadeout, 
        phase:function (options) {

            console.log("getting things ready phase");

            
            $input.running(false);

            display.elementsToggle(self.name, "show");


            events.dispatch("imageFunctions");


            setTimeout(function () {

                if (typeof options.complete === "function") options.complete() 
            }, options.duration)

        }
    }
    ]
    

    var load = function () {

        console.log("load controller", self.name);

        setTimeout(function () {

            react.push({
                name:"phases" + self.name,
                state:phases
            });

            // events.dispatch("load" + self.name);

            $scope.runPhase(0);

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


    var build = function () {

        
        processTypes = config.get("types.processTypes")

        $scope.programInput = config.get("global.feedback");
    }


    var enter = function () {


        console.log("enter controller", self.name);


        $input.resetInput();

        $input.setInput({
            gens:20,
            runs:5,
            pop:20,
            session:null
        });

        var input = $input.getInput(false);

        evolve.setup(self.name);

        $scope.settings = $input.setSettings($scope, input);

    }


    if (!pageBuilt) {
        build();
        display.isBuilt(self.name);
    }


    load();

   


}]);