app.factory("api.ws.service", ["utility", 'input.service', '$http', "$q", 'exception', function (u, $input, $http, $q, exception) {
    

    var socket = {};
    var delay = {};

    var prints = {
        evolve:false,
        singles:true
    }

    var names = [
    {
        name:"getBest",
        print:prints.evolve && true
    },
    {
        name:"stepdata",
        print:prints.evovle && true
    },
    {
        name:"running",
        print:prints.evolve && true
    },
    {
        name:"instantiate",
        print:prints.singles && true
    },
    {
        name:"initialize",
        print:prints.singles && true
    },
    {
        name:"input",
        print:prints.evolve && true
    },
    {
        name:"instruct",
        print:prints.singles && true
    },
    {
        name:"refresh",
        print:prints.singles && false
    },
    {
        name:"reset",
        print:prints.singles && false
    },
    {
        name:"simulateTrash",
        print:prints.singles && true
    },
    {
        name:"simulateRecognize",
        print:prints.singles && true
    },
    {
        name:"simulateDigit",
        print:prints.singles && true
    },
    {
        name:"hardStop",
        print:prints.singles && true
    }
    ]
    

    var stopInterval = function (name) {

        clearInterval(delay[name]);
        delay[name] = null;
    }

    var ready = function (name, complete) {

        // console.log("call ready", name);

        delay[name] = setInterval(function () {

            // console.log("readyState", name, socket[name].readyState)

            if (socket[name].readyState === 1) {
                // console.log(name, "is ready");
                if (typeof complete === "function") complete(name);
                stopInterval(name);
            }
            else if (socket[name].readyState === 3) {
                console.log(name, "is closed");
                stopInterval(name);
            }

        }, 100)
    }

    var openWS = function (name, url) {

        var wsUrl = "ws://"+ u.getUrl() +url;

        // console.log("url is", wsUrl);

        socket[name] = new WebSocket(wsUrl, ["protocolOne", "protocolTwo"]);
        // console.log("socket state", socket[name].readyState);
        socket[name].onopen = function (open) {

            console.log("socket opened:", name);        
        }

        socket[name].onclose = function (close) {

            console.log("socket closed:", name);        
        }

        socket[name].onerror = function (error) {

            console.log("Server error:", name, error);
        }

        socket[name].onmessage = function ($message) {

            var message = JSON.parse($message);

            // console.log("this is the message", message);
            return false;
        }
    }

    var onMessageFunc = function (funcName, callback) {

        return function ($message) {

            // console.log("the string message is", $message.data);

            var message = JSON.parse($message.data);

            // console.log("the message is:", funcName, message);

            if (typeof callback === "function") callback({data:message});
            return false;
        }

    }

    var resolveName = function (name) {

        var found = names.find((p) => {

            return p.name == name;
        })        

        var result = (found && (found.print === false || found.print === undefined)) ? false : true;

        console.log("found", found, result);

        if (!found){
            console.log("print not found for name:", name, "returning: true");
        }

        return result;
    }

    var onSendFunc = function (name, data) {

        if (resolveName(name)) console.log("send", name);
        socket[name].send(JSON.stringify(data));
    }

    var open = {
        opened:false,
        delay:1000,
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
        instruct:function () {
            openWS("instruct", "/evolve/instruct");
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

        socket[funcName].onmessage = onMessageFunc(funcName, callback);

        ready(funcName, function (name) {

            onSendFunc(name);
            socket[name].send(JSON.stringify({data:{input:$input.getInput()}}));
        });
    };


    var stepdata = function (callback) {

        // console.log("call setpdata");
        
        var funcName = "stepdata";

        socket[funcName].onmessage = onMessageFunc(funcName, callback);

        ready(funcName, function (name) {

            onSendFunc(name, {data:{input:$input.getInput()}});
        });
        };


    var isRunning = function  (callback) {

            var funcName = "running";

            socket[funcName].onmessage = onMessageFunc(funcName, callback);

            ready(funcName, function (name) {

                onSendFunc(name, {data:{input:$input.getInput(true)}});
            });
    };


    var setInput = function (resend, callback) {

       
        // console.log("setInput http call get input or resendInput");

        var funcName = "input";


        socket[funcName].onmessage = onMessageFunc(funcName, callback);

        ready(funcName, function (name) {
            onSendFunc(name, {data:{input:resend ? $input.resendInput() : $input.getInput()}});
        });
        };


    var instantiate = function (callback) {

        var funcName = "instantiate";

        console.log("instantiate ws call");

        socket[funcName].onmessage = onMessageFunc(funcName, callback);

        ready(funcName, function (name) {
            onSendFunc(name, {message:"instantiate"});
        });
    };


    var initialize = function (callback) {


        console.log("initialize ws call");

        var funcName = "initialize";

        socket[funcName].onmessage = onMessageFunc(funcName, callback);

        ready(funcName, function (name) {
            onSendFunc(name, {data:{input:$input.getInput()}});
        });

    };


    var run = function (callback) {


        // console.log("run call input", $input.getInput(true));

        var funcName = "run";

        socket[funcName].onmessage = onMessageFunc(funcName, function (message) {

            console.log("the message is:", funcName, message);

            if (!message.success) {

                initialize(function () {
                    
                    run(function  () {
                        if (typeof callback === "function") callback(message);
                    });
                });
            }
            else {

                 if (typeof callback === "function") callback(message);
            }

        });

        ready(funcName, function (name) {
            onSendFunc(name, {data:{input:$input.getInput(true)}});
        });
    };

    var instruct = function (clear, callback) {

        var funcName = "instruct";

        socket[funcName].onmessage = onMessageFunc(funcName, callback);

        ready(funcName, function () {
            onSendFunc(name, {data:{input:$input.getInput(), clear:clear}});
        });
    };

    var refreshEnvironment = function (callback) {


        // console.log("refresh environment call get input");

        var funcName = "refresh";

        socket[funcName].onmessage = onMessageFunc(funcName, callback);

        ready(funcName, function (name) {
            onSendFunc(name, {data:{input:$input.getInput()}});
        });
    };

    var resetEnvironment = function (callback) {

        var funcName = "reset";

        socket[funcName].onmessage = onMessageFunc(funcName, callback);

        ready(funcName, function (name) {
            console.log("send", funcName);
            socket[funcName].send(JSON.stringify({data:{input:$input.getInput()}}));
        });
    };


    var simulate = {


        trash:function (_input, callback) {

            var funcName = "simulateTrash";

            socket[funcName].onmessage = onMessageFunc(funcName, callback);

            ready(funcName, function (name) {
                onSendFunc(name, {data:{options:_input, input:$input.getInput()}});
            });

        },
        recognize:function (index, callback) {

            var funcName = "simulateRecognize";



            socket[funcName].onmessage = onMessageFunc(funcName, callback);

            ready(funcName, function () {
                onSendFunc(name, {data:{index:index, input:$input.getInput()}});
            });
        },
        digit:function (index, callback) {

            var funcName = "simulateDigit";


            socket[funcName].onmessage = onMessageFunc(funcName, callback);

            ready(funcName, function (name) {
                onSendFunc(name, {data:{index:index, input:$input.getInput()}})
            });

        }

    };


    var hardStop = function (callback) {


        // console.log("hard stop call get input");

        var funcName = "hardStop";


        socket[funcName].onmessage = onMessageFunc(funcName, callback);

        ready(funcName, function (name) {
            onSendFunc(name, {data:{input:$input.getInput()}});
        });
    };

    var openSockets = function () {

        console.log("call open sockets", "\n\n\n\n\n\n\n\n")

        if (!open.opened) {

            setTimeout(function () {
                
                console.log("open sockets")

                for (var i in open) {

                    if (typeof open[i] === "function") open[i]();
                }

                open.opened = true;

            }, open.delay);
        }
    }


    openSockets();
    

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