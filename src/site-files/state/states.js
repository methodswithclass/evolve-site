stateModule.factory("states", ['$q', 'runtime.state', '$state', '$transitions', 'events.service', 'utility', function ($q, runtime, $state, $transitions, events, u) {

	var _forceMobile = false;

	var prevState;

	var states = runtime.states;

	var baseUrl = function (responsive) {

		return "assets/views/" + u.getInterface() + "/" + (responsive ? ((_forceMobile || checkMobile()) ? "mobile" : "desktop") : "common");
	}


	$transitions.onStart([], function (trans) {

		prevState = trans.from();

		console.log("state change start, to state", trans.to());


		if (u.interfaceChanged()) {

			console.log("interface changed", u.getInterface());

			var found = runtime.stateViewUrls.find((p) => {

				return p.name == trans.to().name;
			})

			var newUrl = baseUrl(found.responsive) + found.url;

			console.log("new url", newUrl);

			trans.to().templateUrl = newUrl;

			u.resetChanged();
		}


		$("#body").scrollTo(0);
	});

	var current = function () {
		return $state.current.name;
	}

	var go = function (state) {
		console.log("go to state", state);
		// console.log("states", states);
		$state.go(state);
	}

	var split = function () {

		var full = current();

		var array = full.split("#");

		var keys = ["program", "page"];

		var name = {};

		for (i in array) {
			name[keys[i]] = array[i];
		}

		return name;
	}

	var check = function (name) {

		for (i in states) {

			if (name == states[i].name) {
				return true;
			}
		}

		return false;
	}
	

	return {
		current:current,
		go:go,
		split:split,
		check:check
	}




}]);