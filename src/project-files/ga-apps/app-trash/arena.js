app.directive("arena", ['$http', 'utility', 'global.service', 'events.service', "react.service", 'api.service', 'input.service', 'display.service', function ($http, u, g, events, react, api, $input, display) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div class='absolute width height'></div>",		
		link:function ($scope, element, attr) {


			var name = "trash";
			var cols;
			var rows;
			var environment;
			var effdim;
			var ed;

			var stageFactor = 0.3;
			var $stage = $("#arena");

			var col = [];
			var arena = [];

			var block = function (input) {

				var self = this;

				$stage = $("#arena");
				$elem = $("#elem");


				var container = document.createElement("div");
				$(container).addClass("absolute border");
				container.style.width = $stage.width()/cols + "px";
				container.style.height = $stage.height()/rows + "px";
				container.style.left = input.x*$stage.width()/cols + "px";
				container.style.top = input.y*$stage.height()/rows + "px";
				// console.log("append container", $elem[0], "\n\n\n", container);
				$elem.append(container);

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

				console.log("clear arena");

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

				// console.log("make blocks, env", env ? true : false, "rows", rows, "cols", cols);

				// console.log("push man object");

				react.push({
					name:"arena.size",
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

					// console.log("make col", i);

					col = [];

					for (var j = 0; j < rows; j++) {

						square = new block({x:i, y:j});
						// console.log("make square", i, j);

						//square.addtext(env.arena[i][j].trash);

						if (env.arena[i][j].trash) {
							//console.log(env.arena[i][j].pos);
							square.placeTrash();
						}

						// console.log("is trash", i, j, square.isdirty());

						col[j] = square;

						// console.log("column", col[j]);
					}

					arena[i] = col;

					// console.log("arena", arena[i]);
				}

				// console.log("arena", arena);

			}

			var setStageSize = function () {

				$stage = $("#arena");

				ed = u.correctForAspect({
					id:"arena",
					factor:stageFactor, 
					aspect:1, 
					width:$(window).width(), 
					height:$(window).height()
				})

				var elem = document.createElement("div");
				elem.id = "elem";
				$(elem).css({width:ed.width, height:ed.height});

				$stage.css({width:ed.width, height:ed.height});


				$stage.append(elem);
			    
			}


			var registerEvents = function () {


			    events.on("resetenv", function () {

			    	// console.log("reset environemnt event");

					makeBlocks(environment)
				})



				events.on("refreshenv", function () {

					// console.log("refresh environment event");

					$stage = $("#arena");

					display.waitForElem({elems:$stage}, function (options) {


						setStageSize();

						api.refreshEnvironment(function (res) {


					    	console.log("Refresh environment", res.data.env);

				            environment = res.data.env;

				            makeBlocks(environment);

					    })

						$(window).resize(function () {

							setStageSize();
						})


					})

				})

			}


			console.log("push functions");

			react.push({
		    	name:"block.clean",
		    	state:cleanBlock
		    })

		    react.push({
		    	name:"register.arena.events",
		    	state:registerEvents
		    })


		}
	}

}]);

