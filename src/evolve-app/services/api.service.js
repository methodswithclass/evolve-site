app.factory("api.service", ["utility", 'input.service', '$http', "$q", 'exception', function (u, $input, $http, $q, exception) {


    var shared = window.shared;
    var g = shared.utility_service;
    var events = shared.events_service;
    var react = shared.react_service;
    var send = shared.send_service;
    

	var getBest = function (callback) {

        var funcName = "getBest";

        // try {
       
        	$http({
        		method:"POST",
        		url:"/evolve/best",
                data:{input:$input.getInput()}
        	})
        	.then(function (res) {

                if (typeof callback === "function")callback(res);

            }, function (err) {

                console.log("before throw Server error:", funcName,  err)

                throw err;
            })
            .catch(exception.catcher("Server error:" + funcName))

        // }
        // catch (err) {

        //     console.log("Server error:", funcName, err)
        // }
        
    }


    var stepdata = function (callback) {

        // console.log("call setpdata");
      
        var funcName = "stepdata";

        // try {

        	$http({
        		method:"POST",
        		url:"/evolve/stepdata",
                data:{input:$input.getInput()}
        	})
        	.then(function (res) {

                // console.log("stepdata raw response", res);

                if (typeof callback === "function") callback(res);

            }, function (err) {

                // console.log("Server error: 'stepdata'", err)

                // return $q.reject(err);
                throw err;
            })
            .catch(exception.catcher("Server error:" + funcName))


        // }
        // catch (err) {
            
        //     console.log("Server error:", funcName, err)
        // }

   	}


   	var isRunning = function  (callback) {


        var funcName = "isRunning";

        // try {

        	$http({
        		method:"POST",
        		url:"/evolve/running",
                data:{input:$input.getInput(true)}
        	})
        	.then(function (res) {

                if (typeof callback === "function") callback(res);

        	}, function (err) {

        		// console.log("Server error: 'isRunning'", err)

                // return $q.reject(err);
                throw err;
        	})
            .catch(exception.catcher("Server error:" + funcName))


        // }
        // catch (err) {
            
        //     console.log("Server error:", funcName, err)
        // }

    }


    var setInput = function (resend, callback) {

       
        // console.log("setInput http call get input or resendInput");

        var funcName = "setInput";

        // try {

        	$http({
        		method:"POST",
        		url:"/evolve/set",
        		data:{input:resend ? $input.resendInput() : $input.getInput()}
        	})
        	.then(function (res) {

                if (typeof callback === "function") callback(res);

            }, function (err) {

                // console.log("Server error: 'setInput'", err)

                // return $q.reject(err);
                throw err;
            })
            .catch(exception.catcher("Server error:" + funcName))


        // }
        // catch (err) {
            
        //     console.log("Server error:", funcName, err)
        // }

   	}


    var instantiate = function (callback) {


        var funcName = "instantiate";

        // try {

            $http({
                method:"GET",
                url:"/evolve/instantiate"
            })
            .then(function (res) {

                if (typeof callback === "function") callback(res);

            }, function (err) {

                // console.log("Server error: 'instantiate'", err)

                // return $q.reject(err);
                throw err;
            })
            .catch(exception.catcher("Server error:" + funcName))


        // }
        // catch (err) {
            
        //     console.log("Server error:", funcName, err)
        // }


    }


   	var initialize = function (callback) {

    
        console.log("initialize http call get input");

        var funcName = "initialize";

        // try {

            $http({
                method:"POST",
                url:"/evolve/initialize",
                data:{input:$input.getInput()}
            })
            .then(function (res) {

                if (typeof callback === "function") callback(res);

            }, function (err) {

                // console.log("Server error: 'initialize'", err)

                // return $q.reject(err);
                throw err;
            })
            .catch(exception.catcher("Server error:" + funcName))


        // }
        // catch (err) {
            
        //     console.log("Server error:", funcName, err)
        // }


    }


    var run = function (callback) {


        // console.log("run call input", $input.getInput(true));

        var funcName = "run";

        // try {

        	$http({
        		method:"POST",
        		url:"/evolve/run", 
        		data:{input:$input.getInput(true)}
        	})
        	.then(function (res) {

                if (!res.data.success) {

                	initialize(function () {
                		
                		run(function  () {
                			if (typeof callback === "function") callback(res);
                		})
                	});
                }
                else {

                	 if (typeof callback === "function") callback(res);
                }

            }, function (err) {

                // console.log("Server error: 'run'", err)

                // return $q.reject(err);
                throw err;
            })
            .catch(exception.catcher("Server error:" + funcName))


        // }
        // catch (err) {
            
        //     console.log("Server error:", funcName, err)
        // }

    }

    var instruct = function (clear, callback) {


        var funcName = "instruct";

        // try {

            $http({
                method:"POST",
                url:"/evolve/instruct",
                data:{input:$input.getInput(), clear:clear}
            })
            .then(function (res) {

                if (typeof callback === "function") callback(res);

            }, function (err) {

                // console.log("Server error: 'instruct'", err);

                // return $q.reject(err);
                throw err;
            })
            .catch(exception.catcher("Server error:" + funcName))


        // }
        // catch (err) {
            
        //     console.log("Server error:", funcName, err)
        // }

    }

    var refreshEnvironment = function (callback) {


        // console.log("refresh environment call get input");


        var funcName = "refresh environment";

        // try {


            $http({
                method:"POST",
                url:"/trash/environment/refresh",
                data:{input:$input.getInput()}
            })
            .then(function (res) {

                console.log("refresh response", res.data);

                if (typeof callback === "function") callback(res);

            }, function (err) {

                // console.log("Server error: 'refresh environment'", err)

                // return $q.reject(err);
                throw err;
            })
            .catch(exception.catcher("Server error:" + funcName))


        // }
        // catch (err) {
            
        //     console.log("Server error:", funcName, err)
        // }

    }

    var resetEnvironment = function (callback) {


        var funcName = "reset environment";

        // try {

            $http({
                method:"POST",
                url:"/trash/environment/reset",
                data:{input:$input.getInput()}
            })
            .then(function (res) {

                if (typeof callback === "function") callback(res);

            }, function (err) {

                // console.log("Server error: 'reset environment'", err)

                // return $q.reject(err);
                throw err;
            })
            .catch(exception.catcher("Server error:" + funcName))


        // }
        // catch (err) {
            
        //     console.log("Server error:", funcName, err)
        // }

    }


    var simulate = {


        trash:function ($input, callback) {

            var funcName = "simulate";


            // try {

                $http({
                    method:"POST",
                    url:"/trash/simulate",
                    data:$input
                })
                .then(function (res) {

                    if (typeof callback === "function") callback(res);

                }, function (err) {

                    // console.log("Server error: 'simulate'", err);

                    // return $q.reject(err);
                    throw err;
                })
                .catch(exception.catcher(funcName))


            // }
            // catch (err) {
                
            //     console.log(funcName, err);
            // }
        

        },
        recognize:function (index, callback) {


            var funcName = "simulate";

            // try {

                $http({
                    method:"POST",
                    url:"/recognize/simulate",
                    data:{index:index, input:$input.getInput()}
                })
                .then(function (res) {

                    if (typeof callback === "function") callback(res);

                }, function (err) {

                    // console.log("Server error while running best individual", err);

                    // return $q.reject(err);
                    throw err;
                })
                .catch(exception.catcher(funcName))


            // }
            // catch (err) {
                
            //     console.log(funcName, err);
            // }
        },
        digit:function (index, callback) {


            var funcName = "simulate";

            // try {

                $http({
                    method:"POST",
                    url:"/recognize/digit",
                    data:{index:index, input:$input.getInput()}
                })
                .then(function (res) {

                    if (typeof callback === "function") callback(res);

                }, function (err) {

                    // console.log("Server error while running best individual", err);

                    // return $q.reject(err);
                    throw err;
                })
                .catch(exception.catcher(funcName))


            // }
            // catch (err) {

            //     console.log(funcName, err);
            // }

        }

    }


    var hardStop = function (callback) {


        console.log("hard stop call get input");

        var funcName = "hardStop";


        // try {

        	$http({
        		method:"POST",
        		url:"/evolve/hardStop",
        		data:{input:$input.getInput()}
        	})
        	.then(function (res) {

                if (typeof callback === "function") callback(res);

            }, function (err) {

                // console.log("Server error: 'hardStop'", err)

                // return $q.reject(err);
                throw err;
            })
            .catch(exception.catcher("Server error:" + funcName))


        // }
        // catch (err) {
            
        //     console.log("Server error:", funcName, err);
        // }

    }

	return {
		getBest:getBest,
		stepdata:stepdata,
		isRunning:isRunning,
		instantiate:instantiate,
		initialize:initialize,
		setInput:setInput,
		run:run,
        instruct:instruct,
		refreshEnvironment:refreshEnvironment,
        resetEnvironment:resetEnvironment,
        simulate:simulate,
		hardStop:hardStop
	}

}]);