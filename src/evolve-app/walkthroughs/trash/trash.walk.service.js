app.factory("trash.walkthrough", ["utility", "phases.service", "control.service", function (u, phases, controlsService) {


	var s = window.shared;
	var g = s.utility_service;
	var send = s.send_service;
	var react = s.react_service;
	var events = s.events_service;


	var self = this;

	self.name = "trash";

	var simulator;

	react.subscribe({
		name:"simulator" + self.name,
		callback:function(x) {
			simulator = x;
		}
	})

	var types = {
		run:"run",
		controls:"controls"
	}

	var grayout = true;
	var indicator = {
		run:true,
		controls:false
	}

	var phase_data = [
	{
		index:0,
		meta:{
			description:"Click here",
			button:"#runtoggle"
		},
		phase:function (options) {

			console.log(self.name, options.index, "phase");
			// toggleIndicator("run");
			$("#runinner").addClass("scaling");
			toggleGrayout(true);
			u.toggle("hide", "walkthroughbutton");
			u.toggle("show", "walkthrough", {delay:300, fade:600});

		},
		complete:function (options) {

			console.log("pushed next button");

			var element = "#evolvedatatoggle";

			$("#runinner").removeClass("scaling");
			
			setTimeout(function () {
				toggleGrayout(false);
				u.toggle("show", "phase1-container");
				u.toggle("hide", "run", {delay:600});
				scrollTo(element, options);
			}, 600);
			
		}
	},
	{
		index:1,
		meta:{
			description:"Simulate results of 100 generations",
			button:"#phase1-ok-button"
		},
		phase:function (options) {


			console.log(self.name, options.index, "phase");

			// u.toggle("show", "run", {delay:1000});

		},
		complete:function (options) {

			var element = "#stagetoggle";

			toggleGrayout(false);
			// if (g.isMobile()) {
			// 	u.toggle("show", "run");
			// }
			$("#playinner").addClass("scaling-lg");
			u.toggle("hide", "phase1-container");
			scrollTo(element, options);
		}
	},
	{
		index:2,
		meta:{
			description:"Press play",
			button:"#playtoggle"
		},
		phase:function (options) {


			console.log(self.name, options.index, "phase");


		},
		complete:function (options) {

			toggleGrayout(false);
			setTimeout(function () {
				controlsService.removeScaling();
			}, 300);

		}
	},
	{
		index:3,
		meta:{
			description:"Go to Refresh",
			button:"#refreshtoggle"
		},
		phase:function (options) {

			console.log(self.name, options.index, "phase");

			//phase3() function below called from events callback defined in phase2 linked to simulation dispatch

		},
		complete:function (options) {

			toggleGrayout(false);
			u.toggle("hide", "phase3-container");
			setTimeout(function () {
				u.toggle("show", "complete-button");
				toggleGrayout(true);
				$("#playinner").addClass("scaling-lg");
				// controlsService.removeScaling();
			}, 300);
			
		}
	},
	{
		index:4,
		meta:{
			description:"repeat with a new trash config",
			button:"#playtoggle"
		},
		phase:function (options) {


			console.log(self.name, options.index, "phase");

		},
		complete:function (options) {
			u.toggle("hide", "complete-button");
			toggleGrayout(false);
		}
	},
	{
		index:5,
		meta:{
			description:"you have completed the wallkthrough",
			button:"#complete-buttontoggle"
		},
		phase:function (options) {


			console.log(self.name, options.index, "phase");

		},
		complete:function (options) {

			toggleGrayout(false);
			u.toggle("hide", "complete-button");
			controlsService.removeScaling();
			u.toggle("show", "walkthroughbutton");
		}
	}
	]


	var toggleIndicator = function (type, force) {


		if (force !== undefined) indicator[type] = force;

		if(indicator[type]) {

			if (type == "controls") u.toggle("show", "phase-container");
			else if (type == "run") u.toggle("show", "phase0-container");
			
			indicator[type] = true;
		}
		else {

			if (type == "controls") u.toggle("hide", "phase-container");
			else if (type == "run") u.toggle("hide", "phase0-container");
			
			indicator[type] = false;
		}
	}

	var toggleGrayout = function (force) {

		if (force !== undefined) grayout = force;
		
		if (grayout) {

			$("#walkthrough-grayout").css({opacity:0.7});
			grayout = true;
		}
		else {
			$("#walkthrough-grayout").css({opacity:0});
			grayout = false;
		}
	}


	var moveElement = function (options) {

		g.waitForElem({elems:[options.top, options.element]}, function ($options) {

			var $ref = $($options.elems[0]);
			var $elem = $($options.elems[1]);

			console.log("moveElement", $options);

			// if ($options.elems[1] == "#phase3-containertoggle") console.log($ref[0]);

			$elem.css({top:$ref.offset().top + options.buffer + "px"});
		})

	}


	var indicateRefreshButton = function () {

		moveElement({element:"#complete-buttontoggle", top:"#main-inner", buffer:(g.isMobile() ? 2000 : 1700)});
		moveElement({element:"#phase3-containertoggle", top:"#main-inner", buffer:(g.isMobile() ? 1800 : 1400)});
	}

	var phase3 = function () {

		console.log("end simulation");

		$("#refreshinner").addClass("scaling-lg");
		toggleGrayout(true);

		// indicateRefreshButton();
		u.toggle("show", "phase3-container");
	}

	var scrollTo = function (elem, options) {

		g.waitForElem({elems:["#main-back", elem]}, function ($options) {
				
			// console.log("scroll next button", $options.elems);
			$($options.elems[0]).scrollTo($options.elems[1])

		});
	}


	var loadPhases = function () {

		// console.log("load phases \n\n\n\n\n")

		phases.loadPhases({name:self.name + "walkthrough", phases:phase_data, run:false});
	}

	var run = function () {

		phases.run(self.name + "walkthrough");
	}


	loadPhases();


	indicateRefreshButton();

	events.on("sim.trash.end", function () {

		phase3();
	})


	return {
		run:run
	}



}]);
