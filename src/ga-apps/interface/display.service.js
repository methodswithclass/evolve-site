app.factory("display.service", ["utility", "events.service", "global.service", function (u, events, g) {



	var $stage = $("#stagetoggle");
	var $controls = $("#controlstoggle");
	var $simdata = $("#simdatatoggle");
	var $evolvedata = $("#evolvedatatoggle");
	var $hud = $("#hudtoggle");
	var $evolve = $("#evolvetoggle");
	var $evolvedata = $("#evolvedatatoggle");

	var winH = 0;
	var winW = 0;
	var $winH;


	events.on("load-display", "stage", function () {

		$stage = $("#stagetoggle");
		$hud = $("#hudtoggle");
		$evolvedata = $("#evolvedatatoggle");

		$stage.css({top:($evolvedata.offset().top - $hud.offset().top) + $evolvedata.height() + 150 + "px"})

		// console.log("evolve data dispatch events, trash sim and controls");

		events.dispatch("load-display", "trash-sim");
		events.dispatch("load-display", "controls");
	})

	var setEvolveHeight = function () {

		$evolve = $("#evolvetoggle");
		$winH = $(window).height();

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

		$evolve = $("#evolvetoggle");

		while(Math.abs($evolve.height() - $(window).height()) > 2) {
			setEvolveHeight();
		}
	}


	var load = function (input) {

		winH = $(window).height();
		winW = $(window).width();

		events.dispatch("load-display", "evolve-data");

		forceEvolveHeight();

	}	


	return {
		forceEvolveHeight:forceEvolveHeight,
		load:load
	}



}])