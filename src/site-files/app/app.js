


var app = angular.module("app", ['stateModule', 'parallaxModule'])


.config(['$locationProvider', 'runtime.stateProvider', function ($locationProvider, runtimeProvider) {


	var shared = window.shared;
	var g = shared.utility_service;


	g.forceMobile();

	
	$locationProvider.html5Mode(true);

	runtimeProvider.initInterface("interface1");

	var states = runtimeProvider.states;

	for (var i = 0; i < states.length; i++) {
	  runtimeProvider.addState(states[i]);
	}


}])

.run(['states', 'config.service', "utility", function (states, config, u) {


	states.go("trash#demo")
}]);




getAngularModules(app);