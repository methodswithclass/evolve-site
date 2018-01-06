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


	events.on("load-display", "stage", function () {

		$stage = $("#stagetoggle");
		$hud = $("#hudtoggle");
		$evolvedata = $("#evolvedatatoggle");

		$stage.css({top:($evolvedata.offset().top - $hud.offset().top) + $evolvedata.height() + 150 + "px", height:(g.isMobile() ? "50%" : "80%")})

		// console.log("evolve data dispatch events, trash sim and controls");

		// events.dispatch("load-display", "trash-sim");
		events.dispatch("load-display", "controls");
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

		while(Math.abs($evolve.height() - $mainBack.height()) > 2) {
			setEvolveHeight();
		}
	}


	var load = function () {

		$mainBack = $("#main-back");

		winH = $mainBack.height();
		winW = $mainBack.width();

		// events.dispatch("fake-batch-events");

		events.dispatch("load-display", "evolve-data");

		forceEvolveHeight();

	}	


	return {
		forceEvolveHeight:forceEvolveHeight,
		load:load
	}



}])