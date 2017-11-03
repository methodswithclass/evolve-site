app.directive("trashman", ["$http", 'react.service', function ($http, react) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div class='absolute width height z-50'></div>",		
		link:function ($scope, element, attr) {

			var name = "trash";
			var d;
			var arena = {width:0, height:0};

			var setData = function ($d) {

				d = $d

				arena = {width:$d.data.width, height:$d.data.height};
			}

			var getData = function () {

		        $http({
		        	method:"GET", 
		        	url:"/evolve/data/" + name
		        })
		        .then(function (res) {

		            console.log("getting data", res.data);

		            var $d = res.data.data;
		            setData($d);

		        }, function (err) {

		            console.log("Server error while getting data", err.message);

		        })

		    }

		    getData();

			var makeMan = function () {

				
				var block = {width:$(element).width()/arena.width, height:$(element).width()/arena.height};

				var container = document.createElement("div");
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

			setTimeout(function () {

				var man = makeMan();

				react.push({
					name:"robot",
					state:man
				});
				
			}, 500);
			

		}
	}

}]);