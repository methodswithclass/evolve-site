app.factory("api.service", ["api.ws.service", function (api) {
    

	var getBest = function (callback) {
        api.getBest(callback);
    };


    var stepdata = function (callback) {
        api.stepdata(callback);
   	};


   	var isRunning = function  (callback) {
        api.isRunning(callback);
    };


    var setInput = function (resend, callback) {
        api.setInput(resend, callback);
   	};


    var instantiate = function (callback) {
        console.log("api instantiate")
        api.instantiate(callback);
    };


   	var initialize = function (callback) {
        console.log("api initialize");
        api.initialize(callback);
    };


    var run = function (callback) {
       api.run(callback);
    };

    var instruct = function (clear, callback) {
        api.instruct(callback);
    };

    var refreshEnvironment = function (callback) {
        api.refreshEnvironment(callback);
    };

    var resetEnvironment = function (callback) {
        api.resetEnvironment(callback);
    };


    var simulate = {


        trash:function (_input, callback) {
            api.simulate.trash(_input, callback);
        },
        recognize:function (index, callback) {
            api.simulate.recognize(index, callback);
        },
        digit:function (index, callback) {
            api.simulate.digit(index, callback);
        }

    };


    var hardStop = function (callback) {
        api.hardStop(callback);
    };

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