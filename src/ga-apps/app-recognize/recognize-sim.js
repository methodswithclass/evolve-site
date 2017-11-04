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

    // var start = function () {

    // 	events.dispatch("neuralNet");
    // }

    var instruct = function (best, complete) {

    	var chunks = 4;
    	var lens = Math.floor(best.dna.length / chunks);

    	var sendChunk = function (i) {

			var end = (i+2)*lens;

			if (i == chunks - 1) {
				end = best.dna.length-1;
			}

    		$http({
	    		method:"POST",
	    		url:"/instruct/", 
    			data:{name:"recognize", chunk:best.dna.slice(i*lens, end)}
	    	})
	    	.then(function (res) {

	    		if (i < chunks) {
	    			sendChuck(i+1);
	    		}
	    		else {
	    			complete();
	    		}

	    	}, function (err) {

	    		console.log("Server error while running best individual", err);

	    	})

	    }

	    sendChunk(0);

    }

    var simulate = function (best) {


    	instruct(best, function () {


    		$http({
	    		method:"POST",
	    		url:"/simulate/", 
				data:{name:"recognize"}
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