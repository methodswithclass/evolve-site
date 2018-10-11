app.factory("trash.walkthrough", ["utility", "phases.service", "controls.service", "trash-sim", function (u, phases, controlsService, simulator) {


	var s = window.shared;
	var g = s.utility_service;
	var send = s.send_service;
	var react = s.react_service;
	var events = s.events_service;


	var self = this;

	self.name = "trash";
	self.full = self.name + "walkthrough";

	var grayout = true;
	var evolveCount = 1;
	var stepdata;


	react.subscribe({
		name:"data" + self.name,
		callback:function(x) {

			if (x.stepdata) stepdata = x.stepdata;
		}
	})


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
		
		if (grayout) {

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


	var moveExistingElement = function ($options, options) {

		var $ref = $options.elems[0];
		var $elem = $options.elems[1];

		// console.log("moveElement", $options);

		// if ($options.elems[1] == "#phase3-containertoggle") console.log($ref[0]);

		var buffer = (typeof options.buffer === "function") ? options.buffer() : options.buffer;

		// console.log("elemArray", options.elemArray, "buffer", buffer);


		var top = $($ref).offset().top

		var $top = top + buffer;

		console.log("top", $ref, top, $top);

		$($elem).css({top:$top + "px"});
	}


	var moveElement = function (options) {

		var elemArray = [];
		elemArray[0] = options.top;
		elemArray[1] = options.element;

		for (var i in options.others) {
			elemArray[elemArray.length] = options.others[i];
		}

		// console.log("elem array", elemArray);

		options.elemArray = elemArray;

		g.waitForElem({elems:elemArray}, function ($$options) {

			// setTimeout(function () {
				moveExistingElement($$options, options);
			// }, 800);
		})

	}


	var indicateRefreshButton = function () {


		moveElement({
			element:"#"+self.name+"phase3-containertoggle", 
			top:"#simParent", 
			buffer:function () {
				// return (g.isMobile() ? 800 : 800) + evolveCount*70;
				return 500
			}
		});

		moveElement({
			element:"#"+self.name+"complete-buttontoggle", 
			top:"#simParent", 
			buffer:function () {
				// return (g.isMobile() ? 1100 : 1100) + evolveCount*70;
				return 800;
			}
		});
	}


	var closeWalkthrough = function () {

		u.toggle("hide", self.name + "walkthrough");
		phases.running(self.full, false);
	}

	var evolveEnd = function (button, options) {

		if (phases.isRunning(self.full)) {


			var element = "#evolvedatatoggle";

			u.toggle("show", self.name + "phase1-container");


			// u.toggle("show", "hud", {delay:300, fade:600});

			indicateRefreshButton();

			setTimeout(function () {
				scrollTo(element, options);
			}, button ? 1200 : 0);
		}
		else {
			console.log("evolveEnd: phases not running");

			u.toggle("show", self.name+"walkthroughbutton");
		}
	}

	var evolveStart = function () {

		if (phases.isRunning(self.full)) {

			// u.toggle("hide", "hud");
			u.toggle("hide", self.name + "complete-button", {fade:300});
			u.toggle("hide", self.name + "phase3-container", {fade:300});
		}
		else {
			console.log("evolveStart: phases not running");

			
			u.toggle("hide", self.name+"walkthroughbutton");
			
		}
	}

	var simEnd = function () {

		if (phases.isRunning(self.full)) {
			console.log("end simulation");

			$("#refreshinner").addClass("scaling-lg");
			u.toggle("hide", self.name + "complete-button", {fade:300});
			u.toggle("show", self.name + "phase3-container", {fade:300});
		}
		else {
			console.log("simEnd: phases not running");
		}
	}

	var simStart = function () {

		if (phases.isRunning(self.full)) {
			console.log("start simulation");

			u.toggle("hide", self.name + "phase1-container");
			u.toggle("hide", self.name + "complete-button", {fade:300});
		}
		else {
			console.log("simStart: phases not running");
		}
	}


	var phase_data = [
	{
		index:0,
		meta:{
			description:"Walkthrough welcome",
			button:"#"+self.name+"walkthroughwelcometoggle"
		},
		phase:function (options) {

			if (phases.isRunning(self.full)) {  
				console.log(self.full, options.index, "phase");
				


				$("#runinner").addClass("scaling");
				toggleGrayout(true);
				u.toggle("hide", "evovle");
				$("#main-inner").css({opacity:0});
				u.toggle("show", self.name + "walkthroughwelcome");
				u.toggle("hide", self.name + "walkthroughbutton");
				u.toggle("show", self.name + "walkthrough", {delay:300, fade:600});
				u.toggle("show", self.name+"ef", {fade:600, delay:300});
			}
			else {
				console.log("phase 0 run: not running");
			}

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {
				console.log("pushed next button");

				simulator.refresh();
				
				u.toggle("show", "run");
				$("#main-inner").css({opacity:1});

            	u.toggle("show", "hud", {fade:600, delay:300});
				u.toggle("hide", self.name + "walkthroughwelcome");
			}
			else {
				console.log(options.meta.button, "clicked: phases not running");
			}
			
		}
	},
	{
		index:1,
		meta:{
			description:"Click here",
			button:"#runtoggle"
		},
		phase:function (options) {

			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {
				console.log("pushed next button");

				$("#runinner").removeClass("scaling");
			}
			else {
				console.log(options.meta.button, "clicked: phases not running");
			}
			
		}
	},
	{
		index:2,
		meta:{
			description:"End Evolution",
			button:"#breakevolve"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			evolveEnd(true, options);
		}
	},
	{
		index:3,
		meta:{
			description:"Simulate results of 100 generations",
			button:"#"+self.name+"phase1-ok-button"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

			// u.toggle("show", "run", {delay:1000});

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {
				var element = "#stagetoggle";

				// toggleGrayout(false);
				toggleControl("play", true);
				u.toggle("hide", self.name + "phase1-container");
				scrollTo(element, options);
			}
			else {
				console.log(options.meta.button, "clicked: phases not running");
			}
		}
	},
	{
		index:4,
		meta:{
			description:"Go to Refresh",
			button:"#refreshinner"
		},
		phase:function (options) {

			console.log(self.full, options.index, "phase");

			//phase3() function below called from events callback defined in phase2 linked to simulation dispatch

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {
				
				u.toggle("hide", self.name + "phase3-container", {delay:200, fade:400});
				if (stepdata.gen > 1) u.toggle("show", self.name + "complete-button", {delay:400, fade:400});
				

				setTimeout(function () {

					if (stepdata.gen > 1) toggleControl("play", true);
				}, 600);
			}
			else {
				console.log(options.meta.button, "clicked: phases not running");
			}
		}
	},
	{
		index:5,
		meta:{
			description:"repeat with a new trash config",
			button:"#playinner"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			simStart();
		}
	},
	{
		index:6,
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
				u.toggle("hide", self.name + "complete-button", {fade:400});
				stopScaling();
				u.toggle("show", self.name + "walkthroughbutton", {delay:200, fade:300});
				phases.running(self.full, false);
			}
			else {
				console.log(options.meta.button, "clicked: phases not running");
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


	// loadPhases();


	


	events.on("sim.trash.start", function () {

		simStart();
	})

	events.on("sim.trash.end", function () {

		simEnd();
	})


	events.on("evolve.trash.start", function () {

		evolveStart();
	});

	events.on("evolve.trash.end", function () {

		evolveCount++;

		setTimeout(function () {
			indicateRefreshButton();
		}, 1000);

		evolveEnd(false, {});
	})

	events.on("evolve.trash.reset", function () {

		evolveCount = 1;

		indicateRefreshButton();
	})


	events.on("back.trash", function () {

		closeWalkthrough();
	})

	events.on("enter.trash.walkthrough", function () {

		indicateRefreshButton();

		loadPhases();

		run();
	})


	return {
		run:run
	}



}]);
