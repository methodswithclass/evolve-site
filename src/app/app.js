

// var react2 = new reactCustom();
// "use strict";

var page = {
	home:"home",
	trash:"trash",
	feedback:"feedback"
}

var goto;

var loadSpeeds = [
{
    name:"normal"
},
{
    name:"fast"
}
]


var demoLoad = {
	normal:loadSpeeds[0].name,
	fast:loadSpeeds[1].name
}

var setInterface = function (inter) {

	// runtimeProvider.initInterface("interface" + inter);

	var shared = window.shared;
	var react = shared.react_service;

	console.log("set interface", inter);

	// u.setInterface(inter);
	
	react.push({
		name:"interface",
		state:"interface" + inter
	})
	
}


var setLoadSpeed = function (display, speed) {


	var shared = window.shared;
	var react = shared.react_service;

	var defaultParams = {
		delay:100,
    	fade:800,
    	duration:100
	}

	var params = display.getParams();
	var currentParams;

    var found = loadSpeeds.find(function (p) {
        return p.name == speed;
    })

	if (params && found) {
        currentParams = params[found.name];
    }
    else {
        console.log("load speed not found default to normal");
        currentParams = defaultParams;
    }


    var allParams = {};

    allParams[loadSpeeds[0].name] = params[loadSpeeds[0].name];
    allParams[loadSpeeds[1].name] = params[loadSpeeds[1].name];


    console.log("push displayParams", currentParams);

    react.push({
        name:"displayParams",
        state:{
        	params:currentParams,
        	loadSpeeds:loadSpeeds,
        	allParams:allParams
        }
    })

}






var appConfiguration = function (inter, forceMobile) {

	
	var shared = window.shared;
	var react = shared.react_service;
	var g = shared.utility_service;


	
	setInterface(inter);

	if (forceMobile) {
		g.forceMobile();
	}

}





var appSetup = function (display, force, name) {


	var shared = window.shared;
	var g = shared.utility_service;


	console.log("app setup", display, force, name);


	var setSpeed = function (force, name) {


		var found = loadSpeeds.find(function (p) {

			return p.name == name;
		})

		if (found) {
			setLoadSpeed(display, found.name);
		}
		else {
			setLoadSpeed(display, loadSpeeds[0].name);
		}
	}


	if (force) {
		setSpeed(name);
	}
	else {
		setSpeed(demoLoad.normal);
		// setSpeed(demoLoad.fast);
	}

	

}





var app = angular.module("app", ['stateModule', 'parallaxModule', 'ngMaterial']);

app.config(['config.serviceProvider', '$locationProvider', '$provide', "$httpProvider", 'runtime.stateProvider', function (configProvider, $locationProvider, $provide, $httpProvider, runtimeProvider) {
	
	var inter;
	var forceMobile;


	$locationProvider.html5Mode(true);


	$httpProvider.defaults.headers.common["Cache-Control"] = "no-cache";

	configProvider.get([
    	"config.interface",
    	"config.forceMobile"
    ])
	.then(function (data) {

		// console.log(data);

		inter = data[0];
		forceMobile = data[1];


		appConfiguration(inter, forceMobile);
		

		
		var states = runtimeProvider.states;

		for (var i = 0; i < states.length; i++) {
			  runtimeProvider.addState(states[i]);
		}

	});

}])

app.run(['states', "config.service", "display.service", function (states, config, display) {

	// config service is loaded as a dependency and loads data into application automatically
	// don't remove this dependency 

	var shared = window.shared;
	var g = shared.utility_service;


	var configPromise = new Promise(function (resolve, reject) {

		resolve([]);

	})
	

	// if (true) {
	if (g.whatDevice() == g.devices.desktop || g.isMobile()) {
		
		try {
			
			configPromise = config.get("config");

			

		}
		catch (e) {
			console.log("Error in landing page switch:", e.message);
			states.go("home");
		}


		configPromise.then(function (data) {


			// console.log(data);

			var config = data;
			var debug = config.debug;
			var activePages = config.activePages;
			var pageIndices = config.pageIndices;
			var landingPage 
			var loadSpeed;


			if (debug.active) {

				landingPage = debug.landingPage
				loadSpeed = debug.loadSpeed;
			}
			else {
				landingPage = config.landingPage;
				loadSpeed = config.loadSpeed;
			}

			appSetup(display, false, loadSpeed);


			switch (landingPage) {

				case pageIndices.home:
					
					states.go("home");
				break;

				case pageIndices.trash:
					
					states.go("trash#demo");
				break;

				case pageIndices.feedback:
					
					states.go("feedback#demo");
				break;

				case pageIndices.recognize:
					
					states.go("recognize#demo");
				break;

				default:
					
					states.go("home");
				break;

			}


			
		})
	}
	else {
		// if (false) {
		states.go("unsupported");
	}



}]);





getAngularModules(app);