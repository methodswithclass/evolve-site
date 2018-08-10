app.factory("display.service", ["utility", 'control.service', 'settings.service', function (u) {



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





	// events.on("load-display", "stage-trash", function () {

	// 	$stage = $("#stagetoggle");
	// 	$hud = $("#hudtoggle");
	// 	$evolvedata = $("#evolvedatatoggle");
	// 	$simdata = $("#simdataParent");
	// 	$arena = $("#arena");
		
	// 	// if (g.isMobile()) {

	// 	// 	g.waitForElem({elems:"#simdataParent"}, function () {

	// 	// 		// $simdata.css({top:$arena.offset().top + "px"});
	// 	// 		// $simdata.css({top:$arena.offset().top + $arena.height() - $("#simParent").offset().top + 200 + "px"});
	// 	// 	})
	// 	// }
	// 	// else {


	// 	// }
	// });


	// events.on("load-display", "stage-feedback", function () {

	// 	$stage = $("#stagetoggle");
	// 	$hud = $("#hudtoggle");
	// 	$controls = $("#controlstoggle");

	// 	// $stage.css({top:($controls.offset().top - $hud.offset().top) + $controls.height() + 100 + "px", height:(g.isMobile() ? "50%" : "50%")})

	// })


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
	// events.on("load-display", "evolve-data-trash", function () {


	// 	evolveDataSetup[u.getInterface()]("trash");

	// 	$(window).resize(function () {

	// 		evolveDataSetup[u.getInterface()]("trash");
	// 	})

	// 	return "success";

	// });


	// console.log("\nregister event evolve-data display\n\n");
	// events.on("load-display", "evolve-data-feedback", function () {


	// 	evolveDataSetup[u.getInterface()]("feedback");

	// 	$(window).resize(function () {

			
	// 		evolveDataSetup[u.getInterface()]("feedback");
	// 	})

	// 	return "success";

	// });


	// console.log("\nregister event evolve-data display\n\n");
	// events.on("load-display", "evolve-data-recognize", function () {


	// 	evolveDataSetup[u.getInterface()]("recognize");

	// 	$(window).resize(function () {
				
	// 		evolveDataSetup[u.getInterface()]("recognize");
	// 	})

	// 	return "success";

	// });





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


            u.toggle("hide", "nav");
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

			u.toggle("show", "nav", {fade:params.fade, delay:params.delay});       
            u.toggle("show", "hud", {fade:params.fade, delay:params.delay});
            u.toggle("show", "stage", {fade:params.fade, delay:params.delay});
            u.toggle("show", "evolvedata", {fade:params.fade, delay:params.delay});
            u.toggle("show", "settings", {fade:params.fade, delay:params.delay});
            u.toggle("show", "controls");
            u.toggle("show", "title");

            u.toggle("enable", "refresh", {fade:params.fade, delay:params.delay});


            if (name == "feedback") {
            	u.toggle("hide", "simdata", {fade:params.fade, delay:params.delay});
            	// u.toggle("hide", "run", {fade:params.fade, delay:params.delay});
            	u.toggle("enable", "play", {fade:params.fade, delay:params.delay});
            }
            else if (name == "trash") {

            	u.toggle("show", "run", {fade:params.fade, delay:params.delay});
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

					// events.dispatch("load-display", "evolve-data-trash");
				}
			},
			{
				index:1,
				phase:function () {

					// events.dispatch("load-display", "stage-trash");
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


					// events.dispatch("load-display", "stage-feedback");
				}
			},
			{
				index:2,
				phase:function () {

					// events.dispatch("load-display", "evolve-data-feedback");
				}
			}
			],
			recognize:[
			{
				index:0,
				phase:function () {

					// events.dispatch("load-display", "evolve-data-recognize");
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