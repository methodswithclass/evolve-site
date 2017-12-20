app.factory("recognize-sim", ['$q', '$http', 'utility', 'events.service', 'send.service', 'react.service', function ($q, $http, u, events, send, react) {
	
	var evdata;

	var makeImage = function () {

	}

	var eraseImage = function () {


	}

	react.subscribe({
		name:"imageFunctions",
		callback:function(x) {

			makeImage = x.makeImage;
			eraseImage = x.eraseImage;
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


    var instruct = function (session, complete) {


    	$http({
    		method:"GET",
    		url:"/evolve/instruct/recognize/" + session
    	})
    	.then(function (res) {

    		console.log("instruct successful", res.body);

    		complete();

    	}, function (err) {

    		console.log("Server error while running best individual", err);

    	})

    }

    var simulate = function (session) {


    	instruct(session, function () {


    		$http({
	    		method:"POST",
	    		url:"/recognize/simulate/" + session
	    	})
	    	.then(function (res) {

	    		makeImage(res.data.image, res.data.output, res.data.label);

	    	}, function (err) {

	    		console.log("Server error while running best individual", err);

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