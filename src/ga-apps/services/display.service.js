app.factory("display.service", ["utility", "events.service", "global.service", function (u, events, g) {



	var $stage = $("#stagetoggle");
	var $arena = $("#arena");
	var $controls = $("#controlstoggle");
	var $simdata = $("#simdatatoggle");
	var $evolvedata = $("#evolvedatatoggle");
	var $hud = $("#hudtoggle");
	var $evolve = $("#evolvetoggle");
	var $evolvedata = $("#evolvedatatoggle");
	var $mainBack = $("#main-back");

	var winH = 0;
	var winW = 0;
	var $winH;


    var params = {
    	delay:100,
    	fade:800
    }

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


	events.on("load-display", "stage-trash", function () {

		$stage = $("#stagetoggle");
		$hud = $("#hudtoggle");
		$evolvedata = $("#evolvedatatoggle");

		$stage.css({top:($evolvedata.offset().top - $hud.offset().top) + $evolvedata.height() + 150 + "px", height:(g.isMobile() ? "50%" : "80%")})

	})


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


	var elementsToggle = function (name, toggle) {



		if (toggle == "hide") {


            u.toggle("hide", "evolve");
            u.toggle("hide", "hud");

            u.toggle("hide", "run");
            u.toggle("hide", "play");
            u.toggle("hide", "refresh");
            u.toggle("hide", "restart");
            u.toggle("hide", "step");
            u.toggle("hide", "stop");

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
            u.toggle("show", "controls", {fade:params.fade, delay:params.delay});
            u.toggle("show", "hud", {fade:params.fade, delay:params.delay});
            u.toggle("show", "evolvedata", {fade:params.fade, delay:params.delay});

            if (name != "feedback") {
            	u.toggle("show", "simdata", {fade:params.fade, delay:params.delay});
            }


            u.toggle("show", "settings", {fade:params.fade, delay:params.delay});


            u.toggle("show", "refresh", {fade:params.fade, delay:params.delay});
            u.toggle("show", "restart", {fade:params.fade, delay:params.delay});
            u.toggle("show", "step", {fade:params.fade, delay:params.delay});
            u.toggle("show", "play", {fade:params.fade, delay:params.delay});
            u.toggle("show", "stop", {fade:params.fade, delay:params.delay});

            if (name != "feedback") {
            	u.toggle("show", "run", {fade:params.fade, delay:params.delay});
        	}


            if (name == "feedback") {
            	u.toggle("enable", "play", {fade:params.fade, delay:params.delay});
        	}
            u.toggle("enable", "refresh", {fade:params.fade, delay:params.delay});


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


	var waitForElem = function (elemArray, complete) {

        var count = 0;

        var checkElements = function (array) {

        	var result = false;
        	var active = {};

        	if (Array.isArray(array)) {

	        	while (Object.keys(active).length < array.length-1) {

	        		// console.log("test array i", array[i]);

	        		for (var i in array) {

		        		if ($(array[i])[0]) {
		        			active[i] = true;
		        		}

	        		}

	        	}

	        	result = true;

        	}
        	else {

        		while (!$(array)[0]) {
        			result = false;
        		}
        		
        		result = true;

        	}

        	return result;
        }

        var waitTimer = setInterval(function () {

            if (checkElements(elemArray) || count >= 500) {

                clearInterval(waitTimer);
                waitTimer = null;

                if (count < 500) {
                    
                    if (typeof complete === "function") complete();
                }
                
            }
            else {

                count++;
            }

        }, 30);
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
		waitForElem:waitForElem,
		setElemScrollTop:setElemScrollTop,
		forceEvolveHeight:forceEvolveHeight,
		load:load,
		getParams:getParams,
		elementsToggle:elementsToggle,
		beenBuilt:beenBuilt,
		isBuilt:isBuilt
	}



}])