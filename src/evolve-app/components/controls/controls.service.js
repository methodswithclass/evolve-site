app.factory("control.service", ["utility", function (u) {



	var s = window.shared;
	var g = s.utility_service;
	var send = s.send_service;
	var react = s.react_service;
	var events = s.events_service;



	    /* ______________________________________________________
    #
    #
    #
    #					Controls
    #
    #
    #________________________________________________________*/


    var orient = {
    	types:{
    		AUTO:"auto",
    		HORIZONTAL:"horizontal",
    		VERTICAL:"vertical"
    	}
    }

    var $orients = {
    	auto:g.isMobile() ? "horizontal" : "vertical",
    	horizontal:"horizontal",
    	vertical:"vertical"
    }


     var controls = [
	{
		name:"refresh",
		selector:"#refreshtoggle",
		inner:"#refreshinner",
		tool:"#refreshtool"
	},
	{
		name:"restart",
		selector:"#restarttoggle",
		inner:"#restartinner",
		tool:"#restarttool"
	},
	{
		name:"step",
		selector:"#steptoggle",
		inner:"#stepinner",
		tool:"#steptool"
	},
	{
		name:"play",
		selector:"#playtoggle",
		inner:"#playinner",
		tool:"#playtool"
	},
	{
		name:"stop",
		selector:"#stoptoggle",
		inner:"#stopinner",
		tool:"#stoptool"
	}
	]

	var runToggle = {
		name:"run",
		selector:"#runtoggle"
	}


	var cntrlBuffer = 20;
	var cntrlWidth;


	var removeScaling = function () {

		controls.forEach(function (value, index) {

			$(value.inner).removeClass("scaling scaling-sm scaling-mm scaling-lg");
		})
	}

	var clickControls = function () {

		g.waitForElem({elems:"#controlstoggle"}, function (options) {

			$(options.elems).click(function () {

				removeScaling();
			})

		});
	}


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
		// hoverFunction({selector:"#runtoggle", tool:"#evolvetool"});

		clickControls();

	}


	var getOrientation = function ($orientation) {

		return $orients[$orientation];
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
		var controlLength = controlWidth*controls.length
		var notch;

		// console.log("control width", controlWidth);

		if (orientation == getOrientation(orient.types.HORIZONTAL)) {	


			zeroTop = $arena.height();


			$control.css({width:controlLength + "px", height:controlWidth + "px", top:zeroTop + 50 + "px"});
			$control.removeClass("vcenter").addClass("hcenter");
		}
		else {

			zeroLeft = 0;

			$control.css({width:controlWidth + "px", height:controlLength + "px", left:zeroLeft - controlWidth - 50 + "px"});
			$control.removeClass("hcenter").addClass("vcenter");
		}


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
			// $(value.selector).css({zIndex:200});

			notch = index*controlWidth + cntrlBuffer/2;

			if (orientation == getOrientation(orient.types.HORIZONTAL)) {
				$(value.selector).css({left:notch + "px"});
			}
			else {
				$(value.selector).css({top:notch + "px"});
			}

		})

	}


	var controlsSetup = function (name) {



		$control = $("#controlsParent");
		$elem = $("#controlstoggle");
		$arena = $("#arena");


		var cntrlWidth;
		var zeroLeft;
		var zeroTop;
		var controlWidth;
		var arenaWidth;

		// orientation = getOrientation(orient.types.AUTO);
		// orientation = getOrientation(orient.types.HORIZONTAL);
		orientation = getOrientation(orient.types.VERTICAL);
		

		// if (name == "trash") {
		//	orientation = wantVertical();
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



		g.waitForElem({elems:"#arena"}, () => {

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


			g.waitForElem({elems:"#stoptoggle"}, function () {

				setHover();
			})

		});

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


	return {
		controlsArray:controls,
		removeScaling:removeScaling
	}



}]);