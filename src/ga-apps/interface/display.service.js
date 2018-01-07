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


	events.on("load-display", "stage-trash", function () {

		$stage = $("#stagetoggle");
		$hud = $("#hudtoggle");
		$evolvedata = $("#evolvedatatoggle");

		$stage.css({top:($evolvedata.offset().top - $hud.offset().top) + $evolvedata.height() + 150 + "px", height:(g.isMobile() ? "50%" : "80%")})

	})


	events.on("load-display", "stage-feedback", function () {

		$stage = $("#stagetoggle");
		$hud = $("#hudtoggle");

		$stage.css({top:"300px", height:(g.isMobile() ? "50%" : "50%")})

	})

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


	var loadPhases = function (phases) {


		console.log(phases);

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

					events.dispatch("load-display", "stage-feedback");
				}
			},
			{
				index:1,
				phase:function () {

					events.dispatch("load-display", "controls-feedback");
				}
			},
			{
				index:2,
				phase:function () {

					events.dispatch("load-display", "evolve-data-feedback");
				}
			}
			]
		}

		console.log(name, phases[name]);


		loadPhases(phases[name]);
		

		forceEvolveHeight();

	}	


	return {
		forceEvolveHeight:forceEvolveHeight,
		load:load
	}



}])