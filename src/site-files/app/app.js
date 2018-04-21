

// var react2 = new reactCustom();
"use strict";

var loadSpeeds = [
{
    name:"normal"
},
{
    name:"fast"
}
]


var setInterface = function (inter) {

	// runtimeProvider.initInterface("interface" + inter);

	var shared = window.shared;
	var react = shared.react_service;


	react.push({
		name:"interface",
		state:"interface" + inter
	})

}


var setLoadSpeed = function (display, speed) {


	var shared = window.shared;
	var observable = window.reactCustom;

	var params = display.getParams();
	var currentParams;

    var found = loadSpeeds.find((p) => {
        return p.name == speed;
    })

    if (found) {
        currentParams = params[speed];
    }
    else {
        console.log("load speed not found default to normal");
        currentParams = params[loadSpeeds[0].name];
    }


    var allParams = {};

    allParams[loadSpeeds[0].name] = params[loadSpeeds[0].name];
    allParams[loadSpeeds[1].name] = params[loadSpeeds[1].name]


    console.log("push displayParams");

    observable.push({
        name:"displayParams",
        state:{
        	params:currentParams,
        	loadSpeeds:loadSpeeds,
        	allParams:allParams
        }
    })

}






var appConfiguration = function () {

	


	setInterface(1);
	// setInterface(2);




	// g.forceMobile();



}





var appSetup = function (display) {


	console.log("app setup");


	setSpeedIndex = function (index) {

		if (index >= 0 && index < loadSpeeds.length) {
			setLoadSpeed(display, loadSpeeds[index].name);
		}
	}


	
	// setSpeedIndex(0);
	setSpeedIndex(1);



}





var app = angular.module("app", ['stateModule', 'parallaxModule'])

.config(['$locationProvider', 'runtime.stateProvider', function ($locationProvider, runtimeProvider) {


	appConfiguration();


	$locationProvider.html5Mode(true);

	var states = runtimeProvider.states;

	for (var i = 0; i < states.length; i++) {
	  runtimeProvider.addState(states[i]);
	}


}])

.run(['states', "config.service", "display.service", function (states, config, display) {

	// config service is loaded as a dependency and loads data into application automatically
	// don't remove this dependency 

	appSetup(display);

	// states.go("home");
	states.go("trash#demo");
}]);




getAngularModules(app);