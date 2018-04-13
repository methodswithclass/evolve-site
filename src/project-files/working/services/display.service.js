app.factory("display.service", ["utility", function (u) {



	var shared = window.shared;
	var g = shared.utility_service;
	var send = shared.send_service;
	var react = shared.react_service;
	var events = shared.events_service;


	var inter = u.getViewTypes();


	var winH = 0;
	var winW = 0;
	var $winH;



    var params = {
    	delay:100,
    	fade:800
    }


    var $stage = $("#stagetoggle");
	var $arena = $("#arena");
	var $controls = $("#controlstoggle");
	var $simdata = $("#simdatatoggle");
	var $evolvedata = $("#evolvedatatoggle");
	var $hud = $("#hudtoggle");
	var $evolve = $("#evolvetoggle");
	var $evolvedata = $("#evolvedatatoggle");
	var $mainBack = $("#main-back");
	var $run = $("#runtoggle");


    var getParams = function () {

    	return params;
    }

    var hasBeenBuilt = {
    	feedback:false,
    	trash:false,
    	recognize:false
    }


    var beenBuilt = function (name) {

    	return hasBeenBuilt[name];
    }

    var isBuilt = function (name) {

    	hasBeenBuilt[name] = true;
    }




    /* ______________________________________________________
    #
    #
    #
    #					Stage
    #
    #
    #________________________________________________________*/





	events.on("load-display", "stage-trash", function () {

		$stage = $("#stagetoggle");
		$hud = $("#hudtoggle");
		$evolvedata = $("#evolvedatatoggle");

		
		if (g.isMobile()) {

			$stage.css({top:$(window).height() + 100 + "px", height:"50%"})
		}
		else {
			$stage.css({top:$(window).height() + 100  + "px", height:"80%"})
			$("#stageInner").css({top:$("#stagetitle").height() + 100 + "px", left:"50%", marginLeft:"-50%"});
		}
	});


	events.on("load-display", "stage-feedback", function () {

		$stage = $("#stagetoggle");
		$hud = $("#hudtoggle");
		$controls = $("#controlstoggle");

		$stage.css({top:($controls.offset().top - $hud.offset().top) + $controls.height() + 100 + "px", height:(g.isMobile() ? "50%" : "50%")})

	})


	events.on("load-display", "stage-recognize", function () {

		$stage = $("#stagetoggle");
		$hud = $("#hudtoggle");
		$evolvedata = $("#evolvedatatoggle");

		$stage.css({top:($evolvedata.offset().top - $hud.offset().top) + $evolvedata.height() + 150 + "px", height:(g.isMobile() ? "50%" : "80%")})
	})







	    /* ______________________________________________________
    #
    #
    #
    #					Controls
    #
    #
    #________________________________________________________*/





     var controls = [
	{
		name:"refresh",
		selector:"#refreshtoggle",
		tool:"#refreshtool"
	},
	{
		name:"restart",
		selector:"#restarttoggle",
		tool:"#restarttool"
	},
	{
		name:"step",
		selector:"#steptoggle",
		tool:"#steptool"
	},
	{
		name:"play",
		selector:"#playtoggle",
		tool:"#playtool"
	},
	{
		name:"stop",
		selector:"#stoptoggle",
		tool:"#stoptool"
	}
	]

	var runToggle = {
		name:"run",
		selector:"#runtoggle"
	}




	// var cntrlWidth;


	var setHover = function (i) {

		$(controls[i].selector).hover(function () {
			$(controls[i].tool).animate({opacity:1}, 100);
		},
		function () {
			$(controls[i].tool).animate({opacity:0}, 100);
		});
	}


	var controlsWidth = function (name) {


		$elem = $("#controlstoggle");
		$aren = $("#arena");

		if (u.getInterface() == inter.object.one) {

			$(runToggle.selector).css({top:$(window).height()/3 - $(runToggle.selector).height() + "px"});
		}



		cntrlWidth = u.getInterface() == inter.object.one ? 50 : 50;


		g.waitForElem({elems:["#arena"]}, () => {




			if (g.isMobile()) {

				var zeroLeft = $arena.position().left;
				var zeroTop = $arena.position().top + $arena.height();

				$elem.css({left:zeroLeft, top:zeroTop});
			}
			else {

				$elem.css({top:$arena.position().top + "px", width:(u.getInterface() == inter.object.one ? 70 : 70) + "px"});
			}


		})


		
		
		


		if (name == "feedback") {

			$elem.css({top:"50px", zIndex:50});
		}
		
		controls.forEach(function (value, index, array) {

			if (g.isMobile()) {

				$(value.selector).css({left:index*(cntrlWidth + 10) + "px"});
			}
			else {

				$(value.selector).css({top:index*(cntrlWidth + 10) + "px"})
			}

			
		})

	}


	// console.log("\nregister event controls display\n\n");
	events.on("load-display", "controls-trash", function () {

		// g.waitForElem({elems:"#stoptoggle"}, function () {
			controlsWidth("trash");
		// });

		$(window).resize(function () {

			console.log("resize");
		})

		return "success";
	})

	events.on("load-display", "controls-feedback", function () {

		controlsWidth("feedback");

		$(window).resize(function () {

			console.log("resize");

			controlsWidth("feedback");
		})

		return "success";

	})

	events.on("load-display", "controls-recognize", function () {

		controlsWidth("recognize");

		$(window).resize(function () {

			console.log("resize");

			controlsWidth("recognize");
		})

		return "success";

	})

	controls.forEach(function (value, index) {

		setHover(index);
	})






	    /* ______________________________________________________
    #
    #
    #
    #					Evolve Data
    #
    #
    #________________________________________________________*/







	var evwidth = 0.8;
	var width = 0.8;
	
	var evolveDataWidth = function (name) {

		winW = $(window).width();
		winH = $(window).height();

		$evolve = $("#evolvedatatoggle");
		$hud = $("#hudtoggle");
		$stage = $("#stagetoggle");
		$arena = $("#arena");
		$run = $("#runtoggle");


		console.log("\n\ncontrols modile", g.isMobile());



		if (name == "trash" || name == "recognize") {
			
			if (u.getInterface() == inter.object.one) {
				$evolve.css({top:$(window).height()*2/3 + "px"});
			}
		}
		else if (name == "feedback") {
			$evolve.css({top:($stage.offset().top - $hud.offset().top) + $arena.height() + 200 + "px"});	
		}
		
	}

	// console.log("\nregister event evolve-data display\n\n");
	events.on("load-display", "evolve-data-trash", function () {


		// console.log("\nevolve data load display\n\n");

		evolveDataWidth("trash");

		$(window).resize(function () {

			evolveDataWidth("trash");
		})

		return "success";

	});


	// console.log("\nregister event evolve-data display\n\n");
	events.on("load-display", "evolve-data-feedback", function () {


		// console.log("\nevolve data load display\n\n");

		evolveDataWidth("feedback");

		$(window).resize(function () {

			evolveDataWidth("feedback");
		})

		return "success";

	});


	// console.log("\nregister event evolve-data display\n\n");
	events.on("load-display", "evolve-data-recognize", function () {


		// console.log("\nevolve data load display\n\n");

		evolveDataWidth("recognize");

		$(window).resize(function () {

			evolveDataWidth("recognize");
		})

		return "success";

	});





	    /* ______________________________________________________
    #
    #
    #
    #					Display
    #
    #
    #________________________________________________________*/




    var updateProgressBar = function (percent) {


        $("#rundata").css({width:percent*100 + "%"});
    }



	var elementsToggle = function (name, toggle) {


    	var settingsWidth = 800;
    	var openStatus = {opened:false, right:{opened:-20, closed:(-1)*settingsWidth}};

		if (toggle == "hide") {


            $("#settingstoggle").css({right:openStatus.right.closed});


			u.toggle("hide", "break");
            u.toggle("hide", "evolve");
            u.toggle("hide", "hud");

            u.toggle("hide", "run");

            u.toggle("hide", "settings");


            u.toggle("disable", "refresh");
            u.toggle("disable", "restart");
            u.toggle("disable", "step");
            u.toggle("disable", "play");
            u.toggle("disable", "stop");

        }
        else if (toggle == "show") {

			                    
            u.toggle("show", "hud", {fade:params.fade, delay:params.delay});

            u.toggle("show", "stage", {fade:params.fade, delay:params.delay});
            u.toggle("show", "evolvedata", {fade:params.fade, delay:params.delay});

            u.toggle("show", "settings", {fade:params.fade, delay:params.delay});

            u.toggle("show", "run");
            u.toggle("show", "controls");
            

            u.toggle("enable", "refresh", {fade:params.fade, delay:params.delay});


            if (name == "feedback") {
            	u.toggle("hide", "simdata", {fade:params.fade, delay:params.delay});
            	u.toggle("hide", "run", {fade:params.fade, delay:params.delay});
            	u.toggle("enable", "play", {fade:params.fade, delay:params.delay});
            }
            else if (name == "trash") {

            	u.toggle("show", "simdata", {fade:params.fade, delay:params.delay});
            }

        }



    }


	var setEvolveHeight = function () {

		$mainBack = $("#main-back");
		$evolve = $("#evolvetoggle");
		$winH = $mainBack.height();

		winH = winH > $winH ? winH : $winH;

		// console.log("evolve toggle", evolveToggle.input[0]);

		$evolve.css({height:winH + "px"});

	}

	var setupEvolve = function() {

		setEvolveHeight();

		$(window).resize(function () {

			setEvolveHeight();
		})
	}

	var forceEvolveHeight = function () {

		$mainBack = $("#main-back");
		$evolve = $("#evolvetoggle");

		while(($evolve[0] ? true : false) && ($mainBack[0] ? true : false) && Math.abs($evolve.height() - $mainBack.height()) > 2) {
			setEvolveHeight();
		}
	}

	var setElemScrollTop = function (elem, scrollTop) {


		var $hud = $("#hudtoggle")

		$(elem).css({top:(scrollTop ? scrollTop : (-1)*$hud.offset().top) + "px"});

	}

	

	var loadPhases = function (phases) {


		// console.log(phases);

		var runPhase = function (i) {

			
			phases[i].phase();


			if (i < phases.length-1) {
				runPhase(i + 1);
			}
			
		}

		
		runPhase(0);

	}


	var load = function (name) {

		// console.log("display load \n\n\n\n\n\n")

		$mainBack = $("#main-back");

		winH = $mainBack.height();
		winW = $mainBack.width();

		// events.dispatch("fake-batch-events");

		var phases = {
			trash:[
			{
				index:0,
				phase:function () {

					events.dispatch("load-display", "evolve-data-trash");
				}
			},
			{
				index:1,
				phase:function () {

					events.dispatch("load-display", "stage-trash");
				}
			},
			{
				index:2,
				phase:function () {

					events.dispatch("load-display", "controls-trash");
				}
			}
			],
			feedback:[
			{
				index:0,
				phase:function () {

					events.dispatch("load-display", "controls-feedback");
				}
			},
			{
				index:1,
				phase:function () {


					events.dispatch("load-display", "stage-feedback");
				}
			},
			{
				index:2,
				phase:function () {

					events.dispatch("load-display", "evolve-data-feedback");
				}
			}
			],
			recognize:[
			{
				index:0,
				phase:function () {

					events.dispatch("load-display", "evolve-data-recognize");
				}
			},
			{
				index:1,
				phase:function () {

					events.dispatch("load-display", "stage-recognize");
				}
			},
			{
				index:2,
				phase:function () {

					events.dispatch("load-display", "controls-recognize");
				}
			},
			{
				index:3,
				phase:function () {
					events.dispatch("setup-digit");
				}
			}
			]
		}

		// console.log(name, phases[name]);


		loadPhases(phases[name]);
		

		forceEvolveHeight();

	}	


	return {
		waitForElem:g.waitForElem,
		setElemScrollTop:setElemScrollTop,
		forceEvolveHeight:forceEvolveHeight,
		load:load,
		getParams:getParams,
		elementsToggle:elementsToggle,
		beenBuilt:beenBuilt,
		isBuilt:isBuilt,
		updateProgressBar:updateProgressBar
	}



}])