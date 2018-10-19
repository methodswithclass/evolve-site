app.factory("trash.walkthrough", ["utility", "phases.service", "controls.service", "trash-sim", "toast.service", function (u, phases, controlsService, simulator, $toast) {


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

		$("#runinner").removeClass("scaling");
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
			element:"#"+self.name+"phase3-containertoggle", 
			ref:"#simParent",
			main:"#main-inner",
			buffer:function () {
				// return (g.isMobile() ? 800 : 800) + evolveCount*70;
				return -200
			}
		});

		moveElement({
			element:"#"+self.name+"complete-buttontoggle", 
			ref:"#simParent",
			main:"#main-inner",
			buffer:function () {
				// return (g.isMobile() ? 1100 : 1100) + evolveCount*70;
				return 100;
			}
		});
	}

	



	var showToast = function (options) {

		$toast.showToast({message:options.meta.description, delay:options.meta.toast.delay, duration:options.meta.toast.duration});
				
	}





	/*

	############################################


	event functions


	############################################


	*/


	var closeWalkthrough = function () {

		u.toggle("hide", self.name + "walkthrough");
		phases.running(self.full, false);
	}


	var evolveEnd = function (button, options) {

		if (phases.isRunning(self.full)) {


			var element = "#evolvedatatoggle";

			u.toggle("show", self.name + "phase1-container");


			showToast(options);


			// u.toggle("show", "hud", {delay:300, fade:600});

			indicateRefreshButton();

			setTimeout(function () {
				scrollTo(element, options);
				u.toggle("show", self.name + "complete-aux-button", {fade:300});
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
			u.toggle("hide", self.name + "complete-aux-button", {fade:300});
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

	var simStart = function (options) {

		if (phases.isRunning(self.full)) {
			console.log("start simulation");


			showToast(options);

			u.toggle("hide", self.name + "phase1-container");
			u.toggle("hide", self.name + "complete-button", {fade:300});
		}
		else {
			console.log("simStart: phases not running");
		}
	}


	var walkthroughComplete = function (options) {

		showToast(options);

		toggleGrayout(false);
		u.toggle("hide", self.name + "complete-button", {fade:400});
		u.toggle("hide", self.name + "complete-aux-button", {fade:400});
		stopScaling();
		u.toggle("show", self.name + "walkthroughbutton", {delay:200, fade:300});
		phases.running(self.full, false);
	}




	/*

	############################################


	event functions


	############################################


	*/








	/*

	#########################################


	Phases


	#########################################


	*/



	var phase = {};
	var phase_data = [];



	/*

		welcome to the trash pickup walkthrough
	*/

	
	phase = {
		index:0,
		meta:{
			description:"welcome to the trash pickup walkthrough",
			toast:{
				delay:800,
				duration:1000
			},
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

				showToast(options);

				u.toggle("show", "run");
				$("#main-inner").css({opacity:1});
				u.toggle("show", self.name + "complete-aux-button", {fade:400});
            	u.toggle("show", "hud", {fade:600, delay:300});
				u.toggle("hide", self.name + "walkthroughwelcome");
			}
			else {
				console.log(options.meta.button, "clicked: phases not running");
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
			button:"#runtoggle"
		},
		phase:function (options) {

			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {
				console.log("pushed next button");

				showToast(options);

				$("#runinner").removeClass("scaling");
			}
			else {
				console.log(options.meta.button, "clicked: phases not running");
			}
			
		}
	}


	phase_data.push(phase);
	phase = null;
	phase = {};




	/*

		evolution ended
	*/


	phase = {
		index:2,
		meta:{
			description:"evolution ended",
			toast:{
				delay:2000,
				duration:800
			},
			button:"#breakevolve"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			evolveEnd(true, options);
		}
	}


	phase_data.push(phase);
	phase = null;
	phase = {};




	/*

		now you can simulate the best individual
	*/


	phase = {
		index:3,
		meta:{
			description:"now you can simulate the best individual",
			toast:{
				delay:800,
				duration:2000
			},
			button:"#"+self.name+"phase1-ok-button"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

			// u.toggle("show", "run", {delay:1000});

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {
				var element = "#stagetoggle";


				showToast(options);

				// toggleGrayout(false);
				toggleControl("play", true);
				u.toggle("hide", self.name + "phase1-container");
				scrollTo(element, options);
			}
			else {
				console.log(options.meta.button, "clicked: phases not running");
			}
		}
	}



	phase_data.push(phase);
	phase = null;
	phase = {};




	/*

		trash configuration refreshed
	*/


	phase = {
		index:4,
		meta:{
			description:"trash configuration refreshed",
			toast:{
				delay:800,
				duration:1000
			},
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
				

				showToast(options);

				setTimeout(function () {

					if (stepdata.gen > 1) toggleControl("play", true);
				}, 600);
			}
			else {
				console.log(options.meta.button, "clicked: phases not running");
			}
		}
	}


	phase_data.push(phase);
	phase = null;
	phase = {};




	/*

		running simulation
	*/


	phase = {
		index:5,
		meta:{
			description:"running simulation",
			toast:{
				delay:100,
				duration:1000
			},
			button:"#playinner"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			simStart(options);
		}
	}


	phase_data.push(phase);
	phase = null;
	phase = {};




	/*

		completed the trash walkthrough
	*/


	phase = {
		index:6,
		meta:{
			description:"completed the trash walkthrough",
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
				walkthroughComplete(options);
			}
			else {
				console.log(options.meta.button, "clicked: phases not running");
			}
		}
	}


	
	phase_data.push(phase);
	phase = null;
	phase = {};





	/*

		exited the trash walkthrough
	*/


	phase = {
		index:7,
		meta:{
			description:"exited the trash walkthrough",
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

				walkthroughComplete(options);
			}
			else {
				console.log(options.meta.button, "clicked: phases not running");
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

		evolveEnd(phases.isRunning(self.full), {
			meta:{
				description:"evolution ended",
				toast:{
					delay:2000,
					duration:800
				}
			}
		});
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
