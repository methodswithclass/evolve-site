app.factory("api.ws.service", ["utility", 'input.service', '$http', "$q", 'exception', function (u, $input, $http, $q, exception) {
    

    var socket = {};

    var ready = function (name, complete) {

		var delay = setInterval(function () {

			if (socket[name].readyState === 1) {
				if (typeof complete === "function") complete();
				clearInterval(delay);
				delay = null;
			}
		}, 100)
	}

    var openWS = function (name, url) {

    	socket[name] = new WebSocket("ws://"+ u.getUrl() +url, ["protocolOne", "protocolTwo"]);
		console.log("socket state", socket[name].readyState);
		// socket.open();
		// console.log("socket state", socket.readyState);
		socket[name].onopen = function (open) {

			console.log("socket opened:", name, open);		
		}

		socket[name].onerror = function (error) {

			console.log("Server error:", name, error);
		}
    }

    var open = {
    	best:function () {

	    	openWS("getBest", "/evolve/best");
	    },
	    step:function () {
	    	openWS("stepdata", "/evolve/stepdata");
	    },
	    running:function () {
	    	openWS("running", "/evolve/running");
	    },
	    instantiate:function () {
	    	openWS("instantiate", "/evolve/instantiate");
	    },
	    initialize:function () {
	    	openWS("initialize", "/evolve/initialize");
	    },
	    run:function () {

	    	openWS("run", "/evolve/run");
	    },
	    input:function () {
	    	openWS("input", "/evolve/set");
	    },
	    refresh:function () {
	    	openWS("refresh", "/trash/environment/refresh");
	    },
	    reset:function () {
	    	openWS("reset", "/trash/environment/reset");
	    },
	    simulate:function () {
	    	openWS("simulateTrash", "/trash/simulate");
	    	openWS("simulateRecognize", "/recognize/simulate");
	    	openWS("simulateDigit", "/recognize/digit");
	    },
	    stop:function () {
	    	openWS("hardStop", "/evolve/hardStop");

	    }
	};



	var getBest = function (callback) {
       	
		var funcName = "getBest";

		socket[funcName].onmessage = function (message) {

			console.log("the message is:", funcName, message.data);

			if (typeof callback === "function") callback(message.data);
		}

		ready(funcName, function () {
    		socket.send(JSON.stringify({data:{input:$input.getInput()}}));
		});
    };


    var stepdata = function (callback) {

        // console.log("call setpdata");
      	
      	var funcName = "stepdata";

      	socket[funcName].onmessage = function (message) {

			console.log("the message is:", funcName, message.data);

			if (typeof callback === "function") callback(message.data);
		}

      	ready(funcName, function () {
        	socket.send(JSON.stringify({data:{input:$input.getInput()}}));
    	});
   	};


   	var isRunning = function  (callback) {

   		var funcName = "running";

   		socket[funcName].onmessage = function (message) {

			console.log("the message is:", funcName, message.data);

			if (typeof callback === "function") callback(message.data);
		}

   		ready(funcName, function () {
        	socket.send(JSON.stringify({data:{input:$input.getInput(true)}}));
    	});
    };


    var setInput = function (resend, callback) {

       
        // console.log("setInput http call get input or resendInput");

        var funcName = "input";


        socket[funcName].onmessage = function (message) {

			console.log("the message is:", funcName, message.data);

			if (typeof callback === "function") callback(message.data);
		}

        ready(funcName, function () {
        	socket.send(JSON.stringify({data:{input:resend ? $input.resendInput() : $input.getInput()}}));
    	});
   	};


    var instantiate = function (callback) {

    	var funcName = "instantiate";


    	socket[funcName].onmessage = function (message) {

			console.log("the message is:", funcName, message.data);

			if (typeof callback === "function") callback(message.data);
		}

    	ready(funcName, function () {
        	socket.send("instantiate");
    	});
    };


   	var initialize = function (callback) {

    
        console.log("initialize http call get input");

        var funcName = "initialize";

        socket[funcName].onmessage = function (message) {

			console.log("the message is:", funcName, message.data);

			if (typeof callback === "function") callback(message.data);
		}

        ready(funcName, function () {
        	socket.send(JSON.stringify({data:{input:$input.getInput()}}));
    	});

    };


    var run = function (callback) {


        // console.log("run call input", $input.getInput(true));

        var funcName = "run";

        // // try {

        // 	$http({
        // 		method:"POST",
        // 		url:"/evolve/run", 
        // 		data:{input:$input.getInput(true)}
        // 	})
        // 	.then(function (res) {

        //         if (!res.data.success) {

        //         	initialize(function () {
                		
        //         		run(function  () {
        //         			if (typeof callback === "function") callback(res);
        //         		});
        //         	});
        //         }
        //         else {

        //         	 if (typeof callback === "function") callback(res);
        //         }

        //     }, function (err) {

        //         // console.log("Server error: 'run'", err)

        //         // return $q.reject(err);
        //         throw err;
        //     })
        //     .catch(exception.catcher("Server error:" + funcName));


        // // }
        // // catch (err) {
            
        // //     console.log("Server error:", funcName, err)
        // // }


        socket[funcName].onmessage = function (message) {

			console.log("the message is:", funcName, message.data);

			if (typeof callback === "function") callback(message.data);
		}

        ready(funcName, function () {
        	socket.send(JSON.stringify({data:{input:$input.getInput(true)}}));
    	});
    };

    var instruct = function (clear, callback) {

    	var funcName = "instruct";

    	ready(funcName, function () {
        	socket.send(JSON.stringify({data:{input:$input.getInput(), clear:clear}}));
    	});
    };

    var refreshEnvironment = function (callback) {


        // console.log("refresh environment call get input");

        var funcName = "refresh";

        socket[funcName].onmessage = function (message) {

			console.log("the message is:", funcName, message.data);

			if (typeof callback === "function") callback(message.data);
		}

        ready(funcName, function () {
        	socket.send(JSON.stringify({data:{input:$input.getInput()}}));
    	});
    };

    var resetEnvironment = function (callback) {

    	var funcName = "reset";

    	ready(funcName, function () {
        	socket.send(JSON.stringify({data:{input:$input.getInput()}}));
    	});
    };


    var simulate = {


        trash:function (_input, callback) {

        	var funcName = "simulateTrash";

        	socket[funcName].onmessage = function (message) {

				console.log("the message is:", funcName, message.data);

				if (typeof callback === "function") callback(message.data);
			}

        	ready(funcName, function () {
            	socket.send(JSON.stringify({data:{options:_input, input:$input.getInput()}}));
        	});

        },
        recognize:function (index, callback) {

        	var funcName = "simulateRecognize";


        	socket[funcName].onmessage = function (message) {

				console.log("the message is:", funcName, message.data);

				if (typeof callback === "function") callback(message.data);
			}

        	ready(funcName, function () {
            	socket.send(JSON.stringify({data:{index:index, input:$input.getInput()}}));
        	});
        },
        digit:function (index, callback) {

        	var funcName = "simulateDigit";


        	socket[funcName].onmessage = function (message) {

				console.log("the message is:", funcName, message.data);

				if (typeof callback === "function") callback(message.data);
			}

        	ready(funcName, function () {
            	socket.send(JSON.stringify({data:{index:index, input:$input.getInput()}}));
        	});

        }

    };


    var hardStop = function (callback) {


        // console.log("hard stop call get input");

        var funcName = "hardStop";


        socket[funcName].onmessage = function (message) {

			console.log("the message is:", funcName, message.data);

			if (typeof callback === "function") callback(message.data);
		}

        ready(funcName, function () {
        	socket.send(JSON.stringify({data:{input:$input.getInput()}}));
    	});
    };


    for (var i in open) {

    	open[i]();
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
	};

}]);