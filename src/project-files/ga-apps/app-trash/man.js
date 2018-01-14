app.directive("trashman", ["$http", 'react.service', function ($http, react) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div class='absolute width height z-50'></div>",		
		link:function ($scope, element, attr) {

			var name = "trash";
			var arena = {width:0, height:0};
			var container;


			var makeMan = function () {
				
				$(container).remove();

				var block = {width:$(element).width()/arena.width, height:$(element).width()/arena.height};

				container = document.createElement("div");
				$(container).addClass("absolute");
				container.style.width = block.width + "px";
				container.style.height = block.height + "px";
				$(element).append(container);

				var inner = document.createElement("div");
				$(inner).addClass("absolute width70 height70 center black-back opacity70 shadow");
				$(container).append(inner);

				return { 
					width:block.width,
					height:block.height,
					outer:$(container),
					inner:$(inner)
				}

			}


			react.subscribe({
		 		name:"man.arena",
		 		callback:function (x) {

		 			arena = {width:x.width, height:x.height};

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