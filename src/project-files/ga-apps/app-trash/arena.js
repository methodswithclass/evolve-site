app.directive("arena", ['$http', 'utility', 'api.service', 'input.service', 'display.service', function ($http, u, api, $input, display) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div class='absolute width height vcenter right0'></div>",		
		link:function ($scope, element, attr) {


			var shared = window.shared;
			var g = shared.utility_service;
			var react = shared.react_service;
			var events = shared.events_service;

			var inter = u.getViewTypes()


			var name = "trash";
			var cols;
			var rows;
			var environment;
			var effdim;
			var ed;


			var $stage = $("#arena");
			

			var col = [];
			var arena = [];


			var block = function (input) {

				var self = this;

				var container = document.createElement("div");
				$(container).addClass("absolute " + (u.getInterface() == inter.object.one ? "border " : "border-white ") + (u.getInterface() == inter.object.one ? "white-back" : "black-back"));
				container.style.width = $(element).width()/cols + "px";
				container.style.height = $(element).height()/rows + "px";

				container.style.left = input.x*$(element).width()/cols + "px";
				container.style.top = input.y*$(element).height()/rows + "px";
				
				$(element).append(container);

				var outline = document.createElement("div");
				$(outline).addClass("absolute width50 height50 center " + (u.getInterface() == inter.object.one ? "border" : "border-white"));
				outline.style.opacity = 0;
				$(container).append(outline);

				var trash = document.createElement("div");
				$(trash).addClass("absolute width height red-back");
				$(outline).append(trash);


				var trashInner = document.createElement("div");
				$(trashInner).addClass("absolute center white font-10");
				$(trash).append(trashInner);


				var icon = document.createElement("i");
				$(icon).addClass("fas fa-trash-alt");
				$(trashInner).append(icon);


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

						if (env.arena[i][j].trash) {
							square.placeTrash();
						}

						col[j] = square;
					}

					arena[i] = col;
				}

			}

			react.push({
		    	name:"block.clean",
		    	state:cleanBlock
		    })

			var setStageSize = function () {

				ed = u.correctForAspect({
					id:"arena",
					factor:g.isMobile() ? 0.4 : 0.25, 
					aspect:1, 
					width:$(window).width(), 
					height:$(window).height()
				})

				$stage.css({width:ed.width, height:ed.height});
			    
			}


		    events.on("resetenv", function () {

		   		makeBlocks(environment)

			})



			events.on("refreshenv", function () {

				g.waitForElem({elems:$stage}, function (options) {


					setStageSize();

					api.refreshEnvironment(function (res) {

			            environment = res.data.env;

			            makeBlocks(environment);

				    })

					$(window).resize(function () {

						setStageSize();
					})


				})

			})


		}
	}

}]);

