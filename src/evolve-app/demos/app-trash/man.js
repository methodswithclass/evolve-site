app.directive("trashman", ["$http", function ($http) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div class='absolute width height z-50'></div>",		
		link:function ($scope, element, attr) {


			var shared = window.shared;
			var g = shared.utility_service;
			var react = shared.react_service;
			var events = shared.events_service;


			var name = "trash";
			var arena = {width:0, height:0};
			var container;


			var makeMan = function () {
				
				// console.log("create man object");

				$(container).remove();

				var block = {width:$(element).width()/arena.width, height:$(element).width()/arena.height};

				container = document.createElement("div");
				$(container).addClass("absolute z-minus-10");
				container.style.width = block.width + "px";
				container.style.height = block.height + "px";
				$(element).append(container);

				var inner = document.createElement("div");
				$(inner).addClass("absolute width70 height70 center black-back border-white rounded5 opacity70 shadow");
				$(container).append(inner);

				var outer = document.createElement("div");
				$(outer).addClass("absolute center font-15 white");
				$(container).append(outer);

				var user = document.createElement("i");
				$(user).addClass("fas fa-user");
				$(outer).append(user);

				return { 
					width:block.width,
					height:block.height,
					outer:$(container),
					inner:$(inner)
				}

			}


			react.subscribe({
		 		name:"arena.size",
		 		callback:function (x) {

		 			// console.log("assign arena size");

		 			arena = {width:x.width, height:x.height};

		 			var man = makeMan();

		 			// console.log("push man object")

					react.push({
						name:"robot",
						state:man
					});

		 		}
		 	});

			
			

		}
	}

}]);