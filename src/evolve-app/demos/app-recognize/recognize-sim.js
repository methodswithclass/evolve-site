app.factory("recognize-sim", ['$q', '$http', 'utility', 'api.service', function ($q, $http, u, api) {
	

	var shared = window.shared;
	var g = shared.utility_service;
	var events = shared.events_service;
	var react = shared.react_service;
	var send = shared.send_service;


	var evdata;

	var makeImage = function () {

	}

	var eraseImage = function () {


	}

	var displayOutput = function () {


	}

	react.subscribe({
		name:"imageFunctions",
		callback:function(x) {

			makeImage = x.makeImage;
			eraseImage = x.eraseImage;
			displayOutput = x.displayOutput;
		}
	});

	react.subscribe({
		name:"ev.recognize",
		callback:function(x) {
			// console.log("set evdata recognize", x);
			evdata = x;
			setup();
		}
	})

	var setup = function () {


	}

	var create = function () {

		// console.log("event create");

        events.dispatch("createDigit");
    }

    var reset = function () {

    	// console.log("event reset");

        events.dispatch("resetDigit");
    }

    var refresh = function () {

    	reset();
    }


    var instruct = function (clear, complete) {


    	api.instruct(clear, function (res) {

    		complete(res);
    	})

    }

    var simulate = function (clear, index) {


    	instruct(clear, function (res) {


    		api.simulate.recognize(index, function (res) {

    			// makeImage(res.data.image, res.data.output, res.data.label);

    			displayOutput(res.data.output);
    		})

    	})

    }


	return {
		setup:setup,
		create:create,
		reset:reset,
		refresh:refresh,
		simulate:simulate
	}

}])