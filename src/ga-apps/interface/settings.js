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



			var toggleOpened = true;
			var opennStatus = {opened:false, right:{opened:-20, closed:-settingsWidth}};
			$("#settingstoggle").css({right:openStatus.right.closed});


			var kindStatus = {
				opened:"z-50",
				closed:"z-20"
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
					top:"10px",
					opacity:1,
					zIndex:20,
					class:kindStatus.opened
				},
				closed:{
					top:"20px",
					opacity:0.2,
					zIndex:10,
					class:kindStatus.closed
				}
			}

			var toggleKind = kinds[0];

			var toggleKindType = function (kindValue) {

				toggleKind = kinds.find(function (p) {

					return p.value == kindValue;
				});


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

				return toggleKind;
			}

			var tabElem = function (kind) {
				
				return {
					tab:$("#" + kind.value + "-tab"),
					cover:$("#sttings-" + kind.value + "-cover"),
					settings:$("#settings-" + kind.value)
				}
			}

			var toggleTab = function (kind) {


				var properties = {
					top:kind.status ? tabParams.opened.top : tapParmas.closed.top, 
					opacity:kind.status ? tabParams.opened.opacity : tapParams.closed.opacity
				}


				// tabElem(kind).main.removeClass(kind.status ? tabParams.closed.class : tapParams.opened.class).addClass(kind.status ? tabParams.opened.class : tapParams.closed.class);

				tabElem(kind).main.css({zIndex:kind.status ? tapParams.opened.zIndex : tabParams.closed.zIndex});

				tabElem(kind).cover.css(properties);
			}


			var manual;

			$scope.settings;

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
					        	name:"manual",
					        	state:$scope.settings
					        })

						}
					}

				});

			}


			$scope.changeInput = function () {


				manual = {
		            gens:parseInt($("#gensinput").val()),
		            runs:parseInt($("#runsinput").val()),
		            goal:$("#goalinput").val(),
		            pop:parseInt($("#popinput").val())
		        }

		        console.log("on change input, manual", manual);

		        react.push({
		        	name:"manual",
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

			$scope.changeSettingKind = function (kindValue) {


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




