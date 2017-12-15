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

			var crossoverMethods;
			var programInput;
			$scope.goals;
			$scope.methods;


			var toggleOpened = true;
			var openStatus = {opened:false, right:{opened:-20, closed:-settingsWidth}};
			$("#settingstoggle").css({right:openStatus.right.closed});


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

				console.log("toggle kind type", kindValue);

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

				console.log("kinds", kinds, toggleKind);



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

				// console.log("toggle tab", kind);

				// var properties = 


				// console.log("elems", tabElem(kind).main[0], tabElem(kind).cover[0], tabElem(kind).settings[0]);

				// tabElem(kind).main.removeClass(kind.status ? tabParams.closed.class : tapParams.opened.class).addClass(kind.status ? tabParams.opened.class : tapParams.closed.class);

				tabElem(kind).main.css({
					top:kind.status ? tabParams.opened.top : tabParams.closed.top,
					zIndex:kind.status ? tabParams.opened.zIndex : tabParams.closed.zIndex
				});

				tabElem(kind).cover.css({
					// top:kind.status ? tabParams.opened.top : tabParams.closed.top, 
					opacity:kind.status ? tabParams.opened.opacity : tabParams.closed.opacity
				});

				tabElem(kind).settings
				.removeClass(kind.status ? tabParams.closed.class : tabParams.opened.class)
				.addClass(kind.status ? tabParams.opened.class : tabParams.closed.class);

				// tabElem(kind).main.css({
				// 	top:getTabParam(kind, "top"),
				// 	zIndex:getTabParam(kind, "zIndex")
				// });

				// tabElem(kind).cover.css({
				// 	top:getTabParam(kind, "top"), 
				// 	opacity:getTabParam(kind, "opacity")
				// });

				// tabElem(kind).settings
				// .removeClass(kind.status ? tabParams.closed.class : tabParams.opened.class)
				// .addClass(getTabParam(kind, "class"));



			}


			var manual;

			$scope.settings;

			console.log("register evolve.vars");
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

			react.subscribe({
				name:"resetInput",
				callback:function(x) {

					$scope.settings = x;
				}
			})

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

						if (!openStatus.opened) {
							
							react.push({
					        	name:"resetInput",
					        	state:$scope.settings
					        })

						}
					}

				});

			}

			// var validate = function () {

			// 	var valid = true;

			// 	var validateValues = {
			// 		gens:{
			// 			value:$("#gensinput").val(),
			// 			validValue:500
			// 		},
			// 		runs:{
			// 			value:$("#runsinput").val(),
			// 			validValue:20
			// 		},
			// 		goal:{
			// 			value:$("#goalinput").val(),
			// 			validValue:"max"
			// 		},
			// 		pop:{
			// 			value:$("#popinput").val(),
			// 			validValue:100
			// 		},
			// 		crossover:{
			// 			parents:{
			// 				value:$("#parentsinput").val(),
			// 				validValue:2
			// 			},
			// 			pool:{
			// 				value:$("#poolinput").val(),
			// 				validValue:0.1
			// 			},
			// 			splicemin:{
			// 				value:$("#splicemininput").val(),
			// 				validValue:1
			// 			},
			// 			splicemax:{
			// 				value:$("#splicemaxinput").val(),
			// 				validValue:12
			// 			},
			// 			mutate:{
			// 				value:$("#mutateinput").val(),
			// 				validValue:0.02
			// 			}
			// 		}

			// 	}

			// 	var valueChecks = {
			// 		gens:checkValues.gens.value > 0,
			// 		runs:checkValues.runs.value > 0,
			// 		goal:checkValues.goal.value == "min" || checkValue.goal.value == "max",
			// 		pop:checkValue.pop.value > 0,
			// 		crossover:{
			// 			parents:checkValue.crossover.parents.value > 2  && checkValue.crossover.parents.value < checkValue.pop.value/2,
			// 			pool:checkValue.crossover.pool.value > Math.floor(checkValue.pop.value/100*0.05),
			// 			splicemin:checkValue.crossover.splicemin > 0 && checkValue.crossover.splicemin < 
			// 		}
			// 	}

			// 	var poolValue = {
			// 		value:$("#poolinput").val(),
			// 		check:parseInt(this.value) < 1,
			// 		validValue:1
			// 	}

			// 	var valueArray = [
			// 		(new poolValue())
			// 	]

			// 	valueArray.map(function (value, index) {

			// 		if (!value.check) {

			// 			valid = false;
			// 			value.value = value.validValue;
			// 		}

			// 	});

			// 	return valid;
			// }

			$scope.changeInput = function () {


				// manual = {
		  //           gens:{
		  //           	current:parseInt($("#gensinput").val())
		  //           },
		  //           runs:{
		  //           	current:parseInt($("#runsinput").val())
		  //           },
		  //           goal:{
		  //           	current:$("#goalinput").val()
		  //           },
		  //           pop:{
		  //           	current:parseInt($("#popinput").val())
		  //           },
		  //           crossover:{
		  //           	parents:{
		  //           		current:parseInt($("#parentsinput").val())
		  //           	},
		  //           	pool:{
		  //           		current:parseFloat($("#poolinput").val())
		  //           	},
		  //           	splicemin:{
		  //           		current:parseInt($("#splicemininput").val())
		  //           	},
		  //           	splicemax:{
		  //           		current:parseInt($("#splicemaxinput").val())
		  //           	},
		  //           	mutate:{
		  //           		current:parseFloat($("#mutateinput").val())
		  //           	}
		  //           }
		  //       }

		  		var defaultMethod = (crossoverMethods ? crossoverMethods.default : undefined) || "multi-parent";

		 		 manual = {
		            gens:parseInt($("#gensinput").val()),
		            runs:parseInt($("#runsinput").val()),
		            goal:$scope.settings ? ($scope.settings.goal || "max") : "max",
		            pop:parseInt($("#popinput").val()),
		            crossover:{
		            	method:$scope.settings ? ($scope.settings.crossover.method || defaultMethod) : defaultMethod,
		            	parents:parseInt($("#parentsinput").val()),
		            	pool:parseFloat($("#poolinput").val()),
		            	splicemin:parseInt($("#splicemininput").val()),
		            	splicemax:parseInt($("#splicemaxinput").val()),
		            	mutate:parseFloat($("#mutateinput").val())
		            }
		        }

		        // validate();

		        console.log("on change input, manual", manual);

		        react.push({
		        	name:"resetInput",
		        	state:manual
		        })

		        return manual;
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

			$scope.changeSettingsKind = function (kindValue) {

				console.log("change settings kind", kindValue);

				kinds.map(function (value, index) {

					toggleKindType(kindValue)

					toggleTab(value);

				});

				

			}


			setTimeout(function () {

				$scope.settings = $scope.changeInput();

				$("#main-back").click(function () {

					animateToggle(false);
				});

			}, 500)
			
		}
	}

}]);




