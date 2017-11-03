stateModule.factory("states", ['$q', 'runtime.state', '$state', '$rootScope', 'events.service', function ($q, runtime, $state, $rootScope, events) {

	var prevState;

	var states = runtime.states;

	$rootScope.$on('$stateChangeSuccess', 
		function(event, toState, toParams, fromState, fromParams) {

			//console.log(toState);	  

			prevState = fromState;

			console.log(toState);

			var leaveName = fromState.name;

			events.dispatch("close" + leaveName);

			$("#body").scrollTo(0);
		}
	);

	var current = function () {
		return $state.current.name;
	}

	var go = function (state) {
		console.log("go to state", state);
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