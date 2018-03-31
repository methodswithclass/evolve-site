


var app = angular.module("app", ['shared.module', 'stateModule', 'parallaxModule'])


.config(['$locationProvider', 'runtime.stateProvider', function ($locationProvider, runtimeProvider) {

	// runtimeProvider.mobile(forceMobile());

	$locationProvider.html5Mode(true);

	runtimeProvider.initInterface("interface2");

	var states = runtimeProvider.states;

	for (var i = 0; i < states.length; i++) {
	  runtimeProvider.addState(states[i]);
	}
}])

.run(['states', 'config.service', function (states, config) {

	states.go("home")
}]);