app.factory("feedback.walkthrough", ["utility", "phases.service", "controls.service", "feedback-sim", "toast.service", function (u, phases, controlsService, simulator, $toast) {

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

	var moveExistingElement = function ($options, options) {

		var $ref = $options.elems[0];
		var $main = $options.elems[1];
		var $elem = $options.elems[2];

		// console.log("moveElement", $options);

		// if ($options.elems[1] == "#phase3-containertoggle") console.log($ref[0]);

		var buffer = (typeof options.buffer === "function") ? options.buffer() : options.buffer;

		// console.log("elemArray", options.elemArray, "buffer", buffer);


		var top = $($ref).offset().top - $($main).offset().top;

		var $top = top + buffer;

		// console.log("top", $ref, top, $top);

		$($elem).css({top:$top + "px"});
	}


	var moveElement = function (options) {

		var elemArray = [];
		elemArray[0] = options.ref;
		elemArray[1] = options.main;
		elemArray[2] = options.element;

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
			element:"#"+self.name+"complete-buttontoggle", 
			top:"#main-inner", 
			main:"#main-inner",
			buffer:(g.isMobile() ? 800 : 800)
		});
		

		moveElement({
			element:"#"+self.name+"phase1-containertoggle", 
			top:"#main-inner",
			main:"#main-inner", 
			buffer:(g.isMobile() ? 600 : 600)
		});
	}




	var showToast = function (options) {

		$toast.showToast({message:options.meta.description, delay:options.meta.toast.delay, duration:options.meta.toast.duration});
				
	}




	/*


	##########################################


	event functions


	#########################################

	*/



	var closeWalkthrough = function () {

		u.toggle("hide", self.name + "walkthrough");
		phases.running(self.full, false);
	}


	var evolveEnd = function (button, options) {

		console.log("evolve end", phases.isRunning(self.full));

		if (phases.isRunning(self.full)) {

			showToast(options);

			setTimeout(function () {

				toggleControl("refresh", true);
				u.toggle("hide", "evolvefeedback", {fade:600, delay:300});
			}, 600);
		}
	}

	var evolveStart = function (options) {

		if (phases.isRunning(self.full)) {

			showToast(options);

			u.toggle("show", self.name+"phase1-container", {delay:200, fade:300});
			u.toggle("hide", self.name+"complete-button", {delay:400, fade:400});
			u.toggle("hide", "evolve");
		}
	}


	var walkthroughComplete = function (options) {

		toggleGrayout(false);
		u.toggle("hide", self.name+"complete-button", {fade:400});
		u.toggle("hide", self.name+"complete-aux-button", {fade:400});
		stopScaling();
		u.toggle("show", self.name+"walkthroughbutton", {delay:200, fade:300});
		phases.running(self.full, false);
	}





	/*


	##########################################


	event functions
	

	#########################################

	*/






	/*

	#########################################


	Phases


	#########################################


	*/





	var phase_data = null;
	var phase = null;
	phase = {};
	phase_data = [];




	/*

		welcome to the feedback walkthrough
	*/



	phase = {
		index:0,
		meta:{
			description:"welcome to the feedback walkthrough",
			toast:{
				delay:800,
				duration:1000
			},
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

				showToast(options);

				
				$("#main-inner").css({opacity:1});
				u.toggle("show", self.name+"complete-aux-button", {fade:400});
				u.toggle("hide", self.name+"walkthroughwelcome");
            	u.toggle("show", "hud", {fade:600, delay:300});
				u.toggle("show", self.name+"ef", {fade:600, delay:300});
				simulator.updateUI();
				toggleControl("play", true);
			}
			
		}
	}


	phase_data.push(phase);
	phase = null;
	phase = {};




	/*

		evolution started
	*/


	phase = {
		index:1,
		meta:{
			description:"evolution started",
			toast:{
				delay:800,
				duration:800
			},
			button:"#playinner"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {
			

			evolveStart();
		}
	}



	phase_data.push(phase);
	phase = null;
	phase = {};



	/*

		info hidden
	*/


	phase = {
		index:2,
		meta:{
			description:"info hidden",
			toast:{
				delay:100,
				duration:800
			},
			button:"#"+self.name+"phase1-ok-button"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {

				showToast(options);

				u.toggle("hide", self.name+"phase1-container", {delay:200, fade:300});
			}
		}
	}


	phase_data.push(phase);
	phase = null;
	phase = {};



	/*

		evolution reset
	*/


	phase = {
		index:3,
		meta:{
			description:"evolution reset",
			toast:{
				delay:800,
				duration:800
			},
			button:"#refreshinner"
		},
		phase:function (options) {

			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {				
				

				showToast(options);

				setTimeout(function () {
					toggleControl("play", true);
				}, 600);
				u.toggle("hide", self.name+"phase1-container", {delay:200, fade:400})
				u.toggle("show", self.name+"complete-button", {delay:400, fdae:400});

			}
		}
	}


	phase_data.push(phase);
	phase = null;
	phase = {};



	/*

		completed the feedback walkthrough
	*/


	phase = {
		index:4,
		meta:{
			description:"completed the feedback walkthrough",
			toast:{
				delay:100,
				duration:1000
			},
			button:"#"+self.name+"complete-buttontoggle"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {
				walkthroughComplete(options)
			}
		}
	}


	phase_data.push(phase);
	phase = null;
	phase = {};


	/*

		exited the feedback walkthrough
	*/


	phase = {
		index:5,
		meta:{
			description:"exited the feedback walkthrough",
			toast:{
				delay:100,
				duration:1000
			},
			button:"#"+self.name+"complete-aux-buttontoggle"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {
				walkthroughComplete(options)
			}
		}
	}


	phase_data.push(phase);
	phase = null;
	phase = {};








	/*

	#########################################


	Phases


	#########################################


	*/



	var loadPhases = function () {

		// console.log("load phases \n\n\n\n\n")

		phases.loadPhases({name:self.full, phases:phase_data, run:false});

	}

	var run = function () {

		phases.run(self.full);
	}


	// loadPhases();


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