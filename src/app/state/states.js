stateModule.factory("states", ['$q', 'runtime.state', '$state', '$rootScope', "utility", function ($q, runtime, $state, $rootScope, u) {


	var shared = window.shared;
	var events = shared.events_service;


	var prevState;

	var states = runtime.states;

	$rootScope.$on('$stateChangeSuccess', 
		function(event, toState, toParams, fromState, fromParams) {

			//console.log(toState);	  

			prevState = fromState;

			console.log(toState);

			// var leaveName = fromState.name;

			// events.dispatch("close" + leaveName);

			$("#body").scrollTo(0);
		}
	);

	var current = function () {
		return $state.current.name;
	}

	var getName = function () {

		return u.stateName(current());
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
		getName:getName,
		go:go,
		split:split,
		check:check
	}




}]);