


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


	var inter = u.getViewTypes();


	if (u.getInterface() == inter.object.one) {

		$("#body").removeClass("scroll-Y-white-narrow").addClass("scroll-Y-dark-narrow");
	}
	else {
		$("#body").removeClass("scroll-Y-dark-narrow").addClass("scroll-Y-white-narrow");
	}



	states.go("trash#demo")
}]);




getAngularModules(app);