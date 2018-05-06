app.directive("trashman", ["$http", 'utility', function ($http, u) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div class='absolute width height vcenter z-50 right0'></div>",		
		link:function ($scope, element, attr) {


			var shared = window.shared;
			var g = shared.utility_service;
			var react = shared.react_service;
			var events = shared.events_service;


			var inter = u.getViewTypes();
			var container;


			var name = "trash";
			var grid;
			var square;

			
			var makeMan = function () {

				// console.log("arena in make man", arena);

				var square = {width:$(element).width()/grid.cols, height:$(element).height()/grid.rows};

				$(container).remove();

				container = document.createElement("div");
				$(container).addClass("absolute width height");
				$(element).append(container);


				var block = document.createElement("div");
				block.style.width = square.width + "px";
				block.style.height = square.height  + "px";
				$(block).addClass("absolute");
				$(container).append(block);

				var man = document.createElement("div");
				$(man).addClass("absolute width70 height70 center opacity70 " + (u.getInterface() == inter.object.one ? "black-back" : "white-back"));
				$(block).append(man);

				var inner = document.createElement("div");
				$(inner).addClass("absolute center font-10 " + (u.getInterface() == inter.object.one ?  "white" : "black"));
				$(man).append(inner);

				var icon = document.createElement("i");
				$(icon).addClass("fas fa-user");
				$(inner).append(icon);

				return { 
					width:$(container).width()/grid.cols,
					height:$(container).height()/grid.rows,
					outer:$(container),
					inner:$(inner)
				}

			}


			react.subscribe({
		 		name:"man.arena",
		 		callback:function (x) {

		 			grid = {cols:x.width, rows:x.height};

		 			var man = makeMan();

					react.push({
						name:"robot",
						state:man
					});

		 		}
		 	});

			
			

		}
	}

}]);