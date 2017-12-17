app.directive("settings", ['global.service', "events.service", "react.service", function (g, events, react) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/interface/settings.html",	
		link:function ($scope, element, attr) {


			// console.log("\n############\ncreate settings directive\n\n");



			var settingsWidth = 800;
			var width = 0.6;

			var manual;
			var crossoverMethods;
			var programInput;


			$scope.goals;
			$scope.methods;
			$scope.settings;



			// console.log("register evolve.vars");
			react.subscribe({
				name:"evolve.vars",
				callback:function (x) {

					crossoverMethods = x.crossoverMethods;

					$scope.methods = [
		    		{
		    			method:crossoverMethods.multiParent
		    		},
		    		{
		    			method:crossoverMethods.multiOffspring
		    		}
		    		]

				}
			})

			react.subscribe({
				name:"programInput" + $scope.name,
				callback:function (x) {

					// console.log("receive program input settings");
					programInput = x;

					$scope.goals = x.goals;
				}
			})







			/*
			##################################
			Open and close functions
	
			*/


			var controls = [
			{
				name:"open",
				input:$("#opensettings"),
				tool:$("#opentool")
			}
			]

			var inputs = [
			{
				input:$("#gensinput")
			},
			{
				input:$("#runsinput")
			},
			{
				input:$("#goalinput")
			},
			{
				input:$("#popinput")
			},
			{
				input:$("#refreshbtn")
			}
			]

			$stage = $("#stage");


			var setHover = function (i) {

				controls[i].input.hover(function () {
					controls[i].tool.animate({opacity:1}, 100);
				},
				function () {
					controls[i].tool.animate({opacity:0}, 100);
				});
			}

			for (i in controls) {
				setHover(i);
			}

			var isFocus = function () {

				for (i in inputs) {
					if (inputs[i].input.is(":focus")) {
						return true;
					}
				}

				return false;
			}



			var toggleOpened = true;
			var openStatus = {opened:false, right:{opened:-20, closed:-settingsWidth}};
			$("#settingstoggle").css({right:openStatus.right.closed});

			var animateToggle = function (open_up) {

				controls[0].tool.animate({opacity:0}, 200);
				$("#settingstoggle").animate({
					
					right:
					
					(
					 (!open_up || openStatus.opened) 
					 ? openStatus.right.closed

					 : (
					    (open_up || openStatus.closed) 
					    ? openStatus.right.opened 
					    : openStatus.right.closed
					    )
					 )

				}, 
				{
					
					duration:300, 
					complete:function () {
						openStatus.opened = !openStatus.opened;
					}

				});

			}

			$scope.animateRefresh = function (complete) {

				toggleOpened = false;
				$("#refreshfeedback").css({opacity:1});
		        $("#refreshfeedback").animate(
		        {
		            top:0, 
		            opacity:0
		        }, 
		        {
		            duration:1000, 
		            complete:function () { 
		                $("#refreshfeedback").css({top:g.isMobile() ? 60 : 20});
		               	complete();
						toggleOpened = true;
		            }
		        }
		        )
			}

			$scope.open = function () {

				console.log("open settings ", openStatus.opened);

				if (!isFocus() && toggleOpened) {
					animateToggle(true);
				}
			}

			setTimeout(function () {

				$("#main-back").click(function () {

					animateToggle(false);
				});

			}, 500)



			/*
			-------------------------------------------
			############################################
			*/










			/*
			############################################
			Toggle Basic and Advanced Kinds of Settings

			*/
			


			var kindStatus = {
				opened:"z-80",
				closed:"z-60"
			}

			var kinds = [
			{
				id:0,
				value:"basic",
				status:true
			},
			{
				id:1,
				value:"advanced",
				status:false
			}
			]

			var tabParams = {
				opened:{
					top:0,
					opacity:0.2,
					zIndex:20,
					class:kindStatus.opened
				},
				closed:{
					top:"20px",
					opacity:0,
					zIndex:10,
					class:kindStatus.closed
				}
			}

			var toggleKind = kinds[0];

			var toggleKindType = function (kindValue) {

				// console.log("toggle kind type", kindValue);

				toggleKind = kinds.find(function (p) {

					return p.value == kindValue;
				});


				// console.log("toggle kinid", toggleKind);

				kinds = kinds.map(function (value, index) {

					if (value.value == toggleKind.value) {

						// sets toggle kind status to true (indicates that kindValue tab has been selected opened)

						value.status = true;
					}
					else {

						// indicates all other tabs closed

						value.status = false;
					}

					return value;

				})

				// console.log("kinds", kinds, toggleKind);



				return toggleKind;
			}

			var getTabParam = function (kind, param) {

				return kind.status ? tabParams.opened[param] : tabParams.closed[param];
			}

			var tabElem = function (kind) {
				
				return {
					main:$("#" + kind.value + "-tab"),
					cover:$("#settings-" + kind.value + "-cover"),
					settings:$("#settings-" + kind.value)
				}
			}

			var toggleTab = function (kind) {


				tabElem(kind).main.css({
					top:getTabParam(kind, "top"),
					zIndex:getTabParam(kind, "zIndex")
				});

				tabElem(kind).cover.css({
					top:getTabParam(kind, "top"), 
					opacity:getTabParam(kind, "opacity")
				});

				tabElem(kind).settings
				.removeClass(kind.status ? tabParams.closed.class : tabParams.opened.class)
				.addClass(getTabParam(kind, "class"));

			}

			$scope.changeSettingsKind = function (kindValue) {

				console.log("change settings kind", kindValue);

				kinds.map(function (value, index) {

					toggleKindType(kindValue)

					toggleTab(value);

				});

			}


			/*
			------------------------------------------
			##########################################
			*/










			/*
			##########################################
			Change settings functions

			*/


			$scope.changeInput = function () {


				var getValue = function (string) {

			    	return parseFloat(string)/100
			    }

		  		var defaultMethod = (crossoverMethods ? crossoverMethods.default : undefined) || "multi-parent";

		 		 manual = {
		            gens:$("#gensinput").val(),
		            runs:$("#runsinput").val(),
		            goal:$scope.settings ? ($scope.settings.goal || "max") : "max",
		            pop:$("#popinput").val(),
		            crossover:{
		            	method:$scope.settings ? ($scope.settings.crossover.method || defaultMethod) : defaultMethod,
		            	parents:$("#parentsinput").val(),
		            	pool:getValue($("#poolinput").val()),
		            	splicemin:$("#splicemininput").val(),
		            	splicemax:$("#splicemaxinput").val(),
		            	mutate:getValue($("#mutateinput").val())
		            },
		            programInput:programInput
		        }

		        $scope.setSettings(manual);

		        $scope.getInput(manual);

			}






			
			
		}
	}

}]);




