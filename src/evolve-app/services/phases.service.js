
app.factory("phases.service", [function () {


	var s = window.shared;
	var g = s.utility_service;
	var send = s.send_service;
	var react = s.react_service;
	var events = s.events_service;


	var self = this;

	var n = "";
	var p = {};

	var $running = {};

	var running = function (n, toggle) {

		console.log("running", n, toggle);

		$running[n] = toggle;

		console.log("is running", $running[n]);
	}

	var isRunning = function (n) {

		console.log("is running", n, $running[n]);
		return $running[n];
	}

	var runPhase = function ($i) {

		p[n][$i].phase(p[n][$i]);

		// only if there is no complete on button click event does the cycle continue unimpeeded
		if (!p[n][$i].complete && $i < p[n].length-1) {
			runPhase($i + 1);
		}

	}


	var run = function (name) {

		console.log("run phases", name);

		n = name;
		running(n, true);
		runPhase(0);
	}


	var addNext = function (n, j, button) {
		
		g.waitForElem({elems:button}, function (options) {

			// console.log("register phase click event for button", options.elems);

			$(options.elems).click(function () {

				console.log("clicked phase", j);
				if (p[n][j].complete) p[n][j].complete(p[n][j]);

				// if (j + 1 < $phases.length-1) $phases[j+1].phase($phases[j+1]);
			})

		});

	}


	var loadPhases = function (options) {

		// console.log("inside load phases", options);

		n = options.name || "none";

		p[n] = [];

		for (var j in options.phases) {

			p[n][j] = options.phases[j];

			var button = p[n][j].meta ? p[n][j].meta.button : null;

			addNext(n, j, button);

		}

		if (options.run) run(n);
	}



	return {
		loadPhases:loadPhases,
		run:run,
		running:running,
		isRunning:isRunning
	}


}]);