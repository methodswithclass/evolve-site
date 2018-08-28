app.factory("trash.walkthrough", ["utility", "phases.service", function (u, phases) {


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
			u.toggle("show", "walkthrough", {delay:300, fade:600});

		},
		complete:function (options) {

			console.log("pushed next button");

			var element = "#evolvedatatoggle";

			toggleGrayout();
			u.toggle("show", "phase1-container");
			scrollTo(element, options);
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

			toggleGrayout();
			indicatePlayButton();
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

			toggleGrayout();

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



		},
		complete:function (options) {

			toggleGrayout();
			

		}
	},
	{
		index:4,
		meta:{
			description:"you have completed the wallkthrough",
			button:"#completed-button"
		},
		phase:function (options) {


			console.log(self.name, options.index, "phase");

		},
		complete:function (options) {

			// toggleGrayout(false);
			u.toggle("hide", "walkthrough");
		}
	}
	]


	var toggleIndicator = function (type) {

		if(indicator[type]) {

			u.toggle("hide", "phase-container");
			indicator[type] = false;
		}
		else {

			u.toggle("show", "phase-container");
			indicator[type] = true;
		}
	}

	var toggleGrayout = function () {

		if (grayout) {

			$("#walkthrough-grayout").css({opacity:0});
			grayout = false;
		}
		else {
			$("#walkthrough-grayout").css({opacity:0.7});
			grayout = true;
		}
	}


	var moveElement = function (options) {

		g.waitForElem({elems:[options.top, options.element]}, function ($options) {

			var $ref = $($options.elems[0]);
			var $elem = $($options.elems[1]);

			$elem.css({top:$ref.offset().top + options.buffer + "px"});
		})

	}

	var indicatePlayButton = function () {

		// moveElement({element:"#phase-containertoggle", top:"#stagetoggle", buffer:1.5*(50+20) + 400*0.8*0.5 + 150});
		// toggleIndicator("controls");

		$("#playinner").addClass("scaling-lg");
	}

	var indicateRefreshButton = function () {

		// u.toggle("show", "phase3-container");
		// moveElement({element:"#phase3-containertoggle", top:"#arena", buffer:100})

		// moveElement({element:"#phase-containertoggle", top:"#refreshtoggle", buffer:0});
		// $("#playinner").removeClass("scaling-lg");
		$("#refreshinner").addClass("scaling-lg");
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


	// moveIndicator(0);


	return {
		run:run
	}



}]);
