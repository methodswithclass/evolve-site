app.directive("arena", ['$http', 'utility', 'global.service', 'events.service', "react.service", 'api.service', function ($http, u, g, events, react, api) {

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
			var environment;
			var effdim;

			var stageFactor = g.isMobile() ? 0.35 : 0.6;
			var $stage = $("#arena");

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

				rows = env.arena.length;
				cols = env.arena.length;

				react.push({
					name:"man.arena",
					state:{
						width:env.arena.length,
						height:env.arena.length
					}
				})

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

						col[j] = square;
					}

					arena[i] = col;
				}

			}


			var makeAspect = function (factor, aspect) {


		        var winW = $(window).width();
		        var winH = $(window).height();

		        var height;
		        var width;

		        var effH = winH*factor;
		        var effW = winW*factor;

		        var primeDim = g.isMobile() ? effW : effH;
		        var altDim = g.isMobile() ? effH*aspect : effW*aspect;


		        if (altDim > primeDim) {
		            altDim = primeDim;
		            primeDim = altDim/aspect;
		        }

		        if (g.isMobile()) {
 
			        width = primeDim;
			        height = altDim;

		        }
		        else {

			        height = primeDim;
			        width = altDim;

		        }

		        return {
		            width:width,
		            height:height
		        }


			}


			setTimeout(function () {

				effdim = makeAspect(stageFactor, 1);

				$stage.css({width:effdim.width, height:effdim.height});
				
			}, 500);


		    react.subscribe({
				name:"create.env",
				callback:function (x) {

					environment = x

					makeBlocks(environment);
				}
			})

		    react.push({
		    	name:"block.clean",
		    	state:cleanBlock
		    })




		    events.on("resetenv", function () {

				makeBlocks(environment)
			})



			events.on("refreshenv", function () {


				api.refreshEnvironment($scope, function (res) {


			    	console.log("Refresh environment");

		            environment = res.data.env;

		            makeBlocks(environment);

			    })

			})


		}
	}

}]);

