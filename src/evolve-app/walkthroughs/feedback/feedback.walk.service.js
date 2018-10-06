app.factory("feedback.walkthrough", ["utility", "phases.service", "controls.service", "feedback-sim", function (u, phases, controlsService, simulator) {

	var s = window.shared;
	var g = s.utility_service;
	var send = s.send_service;
	var react = s.react_service;
	var events = s.events_service;


	var self = this;

	self.name = "feedback";
	self.full = self.name + "walkthrough";

	var allowgrayout = true;
	var grayout = true;

	var toggleControl = function (control, toggle) {

		if (toggle) {
			u.toggle("enable", control);
			$("#" +control + "inner").addClass("scaling-lg");
			// $("#" + control + "toggle").addClass("z-100");
		}
		else {
			// u.toggle("disable", control);
			$("#"+ control + "inner").removeClass("scaling scaling-sm scaling-mm scaling-lg");
		}
	}

	var stopScaling = function () {

		controlsService.controlsArray.forEach(function (value, index) {

			toggleControl(value.name, false);
		})
	}

	var toggleGrayout = function (force) {

		if (force !== undefined) grayout = force;
		
		if (allowgrayout && grayout) {

			$("#"+self.name+"walkthrough-grayout").animate({opacity:0.7}, 300);
			grayout = true;
		}
		else {
			$("#"+self.name+"walkthrough-grayout").animate({opacity:0}, 300);
			grayout = false;
		}

	}

	var scrollTo = function (elem, options) {

		g.waitForElem({elems:["#main-back", elem]}, function ($options) {
				
			// console.log("scroll next button", $options.elems);
			$($options.elems[0]).scrollTo($options.elems[1])

		});
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

		moveElement({element:"#"+self.name+"complete-buttontoggle", top:"#main-inner", buffer:(g.isMobile() ? 800 : 800)});
		moveElement({element:"#"+self.name+"phase1-containertoggle", top:"#main-inner", buffer:(g.isMobile() ? 600 : 600)});
	}


	var closeWalkthrough = function () {

		u.toggle("hide", self.name + "walkthrough");
		phases.running(self.full, false);
	}


	var evolveEnd = function (button) {

		console.log("evolve end", phases.isRunning(self.full));

		if (phases.isRunning(self.full)) {

			setTimeout(function () {

				toggleControl("refresh", true);
				simulator.stop();
				u.toggle("hide", "evolvefeedback", {fade:600, delay:300});
			}, 600);
		}
	}

	var evolveStart = function () {

		if (phases.isRunning(self.full)) {
			u.toggle("show", self.name+"phase1-container", {delay:200, fade:300});
			u.toggle("hide", self.name+"complete-button", {delay:400, fade:400});
			u.toggle("hide", "evolve");
		}
	}

	var phase_data = [
	{
		index:0,
		meta:{
			description:"Walklthrough welcome",
			button:"#"+self.name+"walkthroughwelcometoggle"
		},
		phase:function (options) {

			if (phases.isRunning(self.full)) {  
				console.log(self.full, options.index, "phase");
				$("#main-inner").css({opacity:0});
				toggleGrayout(true);
				u.toggle("show", self.name+"walkthroughwelcome");
				u.toggle("hide", self.name+"walkthroughbutton");
				u.toggle("show", self.name+"walkthrough", {delay:300, fade:600});
			}

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {
				console.log("pushed next button");

				
				$("#main-inner").css({opacity:1});
				u.toggle("hide", self.name+"walkthroughwelcome");
            	u.toggle("show", "hud", {fade:600, delay:300});
				u.toggle("show", self.name+"ef", {fade:600, delay:300});
				simulator.updateUI();
				toggleControl("play", true);
			}
			
		}
	},
	{
		index:1,
		meta:{
			description:"repeat with a new trash config",
			button:"#playinner"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {
			

			evolveStart();
		}
	},
	{
		index:2,
		meta:{
			description:"Simulate results of 100 generations",
			button:"#"+self.name+"phase1-ok-button"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {

				u.toggle("hide", self.name+"phase1-container", {delay:200, fade:300});
			}
		}
	},
	{
		index:3,
		meta:{
			description:"Go to Refresh",
			button:"#refreshinner"
		},
		phase:function (options) {

			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {				
				
				setTimeout(function () {
					toggleControl("play", true);
				}, 600);
				u.toggle("hide", self.name+"phase1-container", {delay:200, fade:400})
				u.toggle("show", self.name+"complete-button", {delay:400, fdae:400});

			}
		}
	},
	{
		index:4,
		meta:{
			description:"you have completed the wallkthrough",
			button:"#"+self.name+"complete-buttontoggle"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {
				toggleGrayout(false);
				u.toggle("hide", self.name+"complete-button", {fade:400});
				stopScaling();
				u.toggle("show", self.name+"walkthroughbutton", {delay:200, fade:300});
				phases.running(self.full, false);
			}
		}
	}
	]


	var loadPhases = function () {

		// console.log("load phases \n\n\n\n\n")

		phases.loadPhases({name:self.full, phases:phase_data, run:false});

	}

	var run = function () {

		phases.run(self.full);
	}


	loadPhases();


	events.on("evolve.feedback.start", function () {

		evolveStart();
	});

	events.on("evolve.feedback.end", function () {

		evolveEnd();
	})

	events.on("back.feedback", function () {

		closeWalkthrough();
	})


	events.on("enter.feedback.walkthrough", function () {

		indicateRefreshButton();

		loadPhases();

		run();
	})


	return {
		run:run
	}

}]);