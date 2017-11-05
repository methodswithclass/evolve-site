app.directive("arena", ['$http', 'utility', 'events.service', "react.service", function ($http, u, events, react) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div class='absolute width height'></div>",		
		link:function ($scope, element, attr) {


			var name = "trash";
			var d;
			var cols;
			var rows;

			var setData = function ($d) {

				d = $d;
 
				cols = $d.data.width;
				rows = $d.data.height;
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


			// var winW = $(window).width();
			var winH = $(window).height();

			// var effW = winW - 20 - 100 - 300 - 30;
			// var effH = winH - 20 - 20 - 30;
			var effHsim = winH - 20 - 20 - 30 - 300;

			// var dim = Math.min(effW, effH - 200);

			var col = [];
			var arena = [];



			var block = function (input) {

				var self = this;

				var container = document.createElement("div");
				$(container).addClass("absolute border");
				container.style.width = $(element).width()/cols + "px";
				container.style.height = $(element).height()/rows + "px";
				container.style.left = input.x*$(element).width()/cols + "px";
				container.style.top = input.y*$(element).height()/rows + "px";
				$(element).append(container);

				var outline = document.createElement("div");
				$(outline).addClass("absolute width40 height40 border center");
				outline.style.opacity = 0;
				$(container).append(outline);

				var trash = document.createElement("div");
				$(trash).addClass("absolute width height red-back");
				$(outline).append(trash);

				self.placeTrash = function () {
					$(outline).css({opacity:1});
				}

				self.isdirty = function () {
					return $(outline).css("opacity") == 1 && $(trash).css("opacity") == 1;
				}

				self.dirty = function () {
					//console.log("set ui to trash");
					$(trash).css({opacity:1});
					return $(trash).css("opacity");
				}

				self.clean = function () {
					//if (ui) console.log("remove trash ui");
					$(trash).css({opacity:0});
					return $(trash).css("opacity");
				}

				self.remove = function () {
					$(container).remove();
				}

				self.addtext = function (text1, text2) {

					$(container).append("<div class='absolute font-30 center'>"+text1+"<br>"+text2+"</div>")
				}
			}

			var clear  = function () {

				for (var i = 0; i < arena.length; i++) {
					for (var j = 0; j < arena[i].length; j++) {
						arena[i][j].remove();
					}
				}

			}

			var cleanBlock = function (i, j) {

				arena[i][j].clean();

			}

			var makeBlocks = function (env) {

				clear();

				var square;
				arena.length = 0;
				arena = null;
				arena = [];

				for (var i = 0; i < cols; i++) {

					col = [];

					for (var j = 0; j < rows; j++) {
						square = new block({x:i, y:j});

						//square.addtext(env.arena[i][j].trash);

						if (env.arena[i][j].trash) {
							//console.log(env.arena[i][j].pos);
							square.placeTrash();
						}

						// for (k in env.trash) {
						// 	if (env.trash[k].x == i && env.trash[k].y == j) {
						// 		square.placeTrash();
						// 	}
						// }

						col[j] = square;
					}

					arena[i] = col;
				}

			}

			var attachInstructions = function (plan) {

				var index = 0;
				var cleaned = 0;

				for (var i = 0; i < cols; i++) {

					for (var j = 0; j < rows; j++) {
						// index = environment.assess({x:i, y:j});

						if (index == 242) {
							cleaned = index - 2*Math.pow(3, 4);
						}

					}
				}

			}



			var refreshEnvironmentBackend = function () {

		        $http({
		            method:"GET",
		            url:"/trash/environment/refresh"
		        })
		        .then(function (res) {

		            console.log("Refresh environment");

		            var env = res.data.env;

		            makeBlocks(env);

		        }, function (err) {

		            console.log("Server error while refreshing environment", err.message);

		        })
		    }

		    react.push({
		    	name:"block.clean",
		    	state:cleanBlock
		    })

			events.on("refreshenv", function () {

				console.log("refresh ui");

				// environment.trash();
				// var env = environment.get();

				refreshEnvironmentBackend();

				// console.log("set state for arena");
				
				// react.push({
				// 	name:"arena", 
				// 	state:arena
				// });

				//environment.addUI(arena);
			})

			setTimeout(function () {

				var effdim = u.dim(1);

				$("#stage").css({width:effdim.width, height:effdim.height});
				$("#simdata").css({height:effHsim});

				//events.dispatch("refreshEnv");
				
			}, 500);

		}
	}

}]);

