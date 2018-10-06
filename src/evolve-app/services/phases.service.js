
app.factory("phases.service", [function () {


	var s = window.shared;
	var g = s.utility_service;
	var send = s.send_service;
	var react = s.react_service;
	var events = s.events_service;


	var self = this;

	var n = "";
	self.p = {};
	var loadCount = {};

	var $running = {};

	var running = function (n, toggle) {

		// console.log("running", n, toggle);

		$running[n] = toggle;

		// console.log("is running", $running[n]);
	}

	var isRunning = function (n) {

		// console.log("is running", n, $running[n]);
		return $running[n];
	}

	var runPhase = function ($i) {

		self.p[n][$i].phase(self.p[n][$i]);

		// only if there is no complete on button click event does the cycle continue unimpeeded
		if (!self.p[n][$i].complete && $i < self.p[n].length-1) {
			runPhase($i + 1);
		}

	}


	var run = function (name) {

		console.log("run phases", name);

		n = name;
		running(n, true);
		runPhase(0);
	}


	var addNext = function ($options) {
		
		var $phases = $options.phases;
		var $name = $options.name;
		var $index = $options.index;
		var $button = $options.button;
		var count = $options.count;

		var clickCount = {};
		clickCount[$name] = 0;

		g.waitForElem({elems:$button}, function (options) {

			// console.log("register phase click event for button", options.elems);

			$(options.elems).click(function () {

				clickCount[$name] += 1;

				console.log("clicked", $phases[$name][$index].index, "phase", $name, $phases[$name][$index].meta.button, "loadCount", count, "clickCount", clickCount[$name]);
				if ($phases[$name][$index].complete) $phases[$name][$index].complete($phases[$name][$index]);

				// if (j + 1 < $phases.length-1) $phases[j+1].phase($phases[j+1]);
			})

		});

	}


	var loadPhases = function (options) {

		// console.log("inside load phases", options);

		n = options.name || "none";

		if (!loadCount.hasOwnProperty(n)) {
			loadCount[n] = 0;
		}

		self.p[n] = [];

		for (var j in options.phases) {

			self.p[n][j] = options.phases[j];

			var button = self.p[n][j].meta ? self.p[n][j].meta.button : null;

			addNext({phases:self.p, name:n, index:j, button:button, count:loadCount[n]});

		}

		if (options.run) run(n);

		loadCount[n] += 1;
	}



	return {
		loadPhases:loadPhases,
		run:run,
		running:running,
		isRunning:isRunning
	}


}]);