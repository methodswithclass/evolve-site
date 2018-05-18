app.factory("display.service", ["utility", function (u) {



	var s = window.shared;
	var g = s.utility_service;
	var send = s.send_service;
	var react = s.react_service;
	var events = s.events_service;


	var inter = u.getViewTypes();


	var winH = 0;
	var winW = 0;
	var $winH;



    var params = {
    	delay:100,
    	fade:800,
    	duration:100
    }

    var paramsFast = {
    	delay:0,
    	fade:0,
    	duration:0
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

    	return {
    		normal:params,
    		fast:paramsFast
    	}
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
		$simdata = $("#simdataParent");
		$arena = $("#arena");
		
		if (g.isMobile()) {

			g.waitForElem({elems:"#simdataParent"}, function () {

				// $simdata.css({top:$arena.offset().top + "px"});
				$simdata.css({top:$arena.offset().top + $arena.height() - $("#simParent").offset().top + 200 + "px"});
			})
		}
		else {


		}
	});


	events.on("load-display", "stage-feedback", function () {

		$stage = $("#stagetoggle");
		$hud = $("#hudtoggle");
		$controls = $("#controlstoggle");

		// $stage.css({top:($controls.offset().top - $hud.offset().top) + $controls.height() + 100 + "px", height:(g.isMobile() ? "50%" : "50%")})

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


	var cntrlBuffer = 20;
	var cntrlWidth;


	var setHover = function () {


		var hoverFunction = function(item) {

			$(item.selector).hover(
			function () {
				$(item.tool).removeClass("none")
				$(item.tool).animate({opacity:1}, 100);
			},
			function () {

				$(item.tool).animate({opacity:0}, 100, function () {

					$(item.tool).addClass("none")
				});
			});
		}


		controls.forEach((value, index) => {
			
			hoverFunction(value);

		});

		hoverFunction({selector:"#opensettings", tool:"#opentool"});

	}


	g.waitForElem({elems:"#controlstoggle"}, function () {

		setHover();
	})

	var orients = {
		vert:"vertical",
		hor:"horizontal"
	}


	var automatic = function () {

		if (g.isMobile()) {

			return orients.hor;
		}
		else {
			return orients.vert;
		}
	}


	var wantHorizontal = function () {

		return orients.hor;
	}


	var wantVertical = function () {

		return orients.vert;
	}


	var positionControlsItems = function (options) {


		var controls = options.controls;
		var cntrlWidth = options.cntrlWidth;
		var cntrlBuffer = options.cntrlBuffer;
		var orientation = options.orientation;
		var $control = options.$control;
		var $arena = options.$arena;
		var arenaWidth = options.arenaWidth;
		var controlWidth = cntrlWidth + cntrlBuffer;
		var controlLength = (cntrlWidth + cntrlBuffer)*controls.length
		var notch;

		g.waitForElem({elems:"#arena"}, () => {


			if (orientation == orients.hor) {	


				zeroTop = $arena.height();


				$control.css({width:controlLength + "px", height:controlWidth + "px", top:zeroTop + 50 + "px"});
				$control.removeClass("vcenter").addClass("hcenter");
			}
			else {

				zeroLeft = 0;

				$control.css({width:controlWidth + "px", height:controlLength + "px", left:zeroLeft - controlWidth - 50 + "px"});
				$control.removeClass("hcenter").addClass("vcenter");
			}

		})


		controls.forEach(function (value, index, array) {



			var totalLength = cntrlWidth*controls.length;
			var itemPercent = cntrlWidth/controls.length;
			var center = 50 - itemPercent/2;

			// var positions = [
			// center-itemPercent-itemPercent/2,
			// center-itemPercent,
			// center,
			// center+itemPercent,
			// center+itemPercent + itemPercent/2
			// ]


			$(value.selector).css({width:cntrlWidth + "px", height:cntrlWidth + "px"});

			notch = index*(cntrlWidth + cntrlBuffer) + cntrlBuffer/2;

			if (orientation == orients.hor) {
				$(value.selector).css({left:notch + "px"});
			}
			else {
				$(value.selector).css({top:notch + "px"});
			}

		})

	}


	var controlsSetup = function (name) {

		// interface1:function (name) {

			$control = $("#controlsParent");
			$elem = $("#controlstoggle");
			$arena = $("#arena");


			var cntrlWidth;
			var zeroLeft;
			var zeroTop;
			var controlWidth;
			var arenaWidth;

			// orientation = automatic();
			// orientation = wantHorizontal();
			
			// if (name == "trash") {
				orientation = wantVertical();
			// }
			// else if (name == "feedback") {
			// 	orientation = wantHorizontal();
			// }

			if (g.isMobile()) {
				
				cntrlWidth = 100;
			}
			else {
				
				cntrlWidth = 50;
			}


			positionControlsItems({
				controls:controls,
				cntrlWidth:cntrlWidth,
				cntrlBuffer:cntrlBuffer,
				controlWidth:controlWidth,
				arenaWidth:arenaWidth,
				orientation:orientation,
				$control:$control,
				$arena:$arena
			});

		// },
		// interface2:function (name) {


		// }
	}


	// console.log("\nregister event controls \n\n");
	events.on("load-display", "controls-trash", function () {

		g.waitForElem({elems:"#arena"}, function () {
			

			// controlsSetup[u.getInterface()]();
			controlsSetup("trash");
		});

		$(window).resize(function () {

			console.log("resize");

			// controlsSetup[u.getInterface()]();
			controlsSetup("trash");
		})

		return "success";
	})

	events.on("load-display", "controls-feedback", function () {

		g.waitForElem({elems:"#arena"}, function () {
			
			
			// controlsSetup[u.getInterface()]();
			controlsSetup("feedback");
		});

		$(window).resize(function () {

			console.log("resize");

			// controlsSetup(u.getInterface())();
			controlsSetup("feedback");
		})

		return "success";

	})

	events.on("load-display", "controls-recognize", function () {

		g.waitForElem({elems:"#arena"}, function () {
			
			
			// controlsSetup[u.getInterface()]();
			controlsSetup("recognize");
		});

		$(window).resize(function () {

			console.log("resize");

			// controlsSetup[u.getInterface()]();
			controlsSetup("recognize");
		})

		return "success";

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
	
	var evolveDataSetup = {

		interface1:function (name) {

			// winW = $(window).width();
			// winH = $(window).height();

			


		},
		interface2:function () {

			// $evolve = $("#evolvedatatoggle");
			// $hud = $("#hudtoggle");
			// $stage = $("#stagetoggle");
			// $arena = $("#arena");
			// $run = $("#runtoggle");


			// console.log("run", $run.offset().top, $run.height());

			// g.waitForElem({elems:"#runtoggle"}, function () {

			// 	console.log("run element", $run[0]);

			// 	var runRect = $run[0].getBoundingClientRect();

			// 	console.log("run", runRect.top, runRect.bottom);

			// 	$evolve.css({left:$run.offset().left + "px", top:runRect.bottom + 100 + "px"});
			// })
			
		}


	}

	// console.log("\nregister event evolve-data display\n\n");
	events.on("load-display", "evolve-data-trash", function () {


		evolveDataSetup[u.getInterface()]("trash");

		$(window).resize(function () {

			evolveDataSetup[u.getInterface()]("trash");
		})

		return "success";

	});


	// console.log("\nregister event evolve-data display\n\n");
	events.on("load-display", "evolve-data-feedback", function () {


		evolveDataSetup[u.getInterface()]("feedback");

		$(window).resize(function () {

			
			evolveDataSetup[u.getInterface()]("feedback");
		})

		return "success";

	});


	// console.log("\nregister event evolve-data display\n\n");
	events.on("load-display", "evolve-data-recognize", function () {


		evolveDataSetup[u.getInterface()]("recognize");

		$(window).resize(function () {
				
			evolveDataSetup[u.getInterface()]("recognize");
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
			u.toggle("hide", "title");
       	 	u.toggle("hide", "breakfeedback");



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
            u.toggle("show", "title");
            

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

		var runPhase = function (i) {

			phases[i].phase();

			if (i < phases.length-1) {
				runPhase(i + 1);
			}
		}

		runPhase(0);
	}


	var load = function (name) {

		$mainBack = $("#main-back");

		winH = $mainBack.height();
		winW = $mainBack.width();

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