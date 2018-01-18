app.directive("plot", ['data', 'utility', 'events.service', 'send.service', 'react.service', 'global.service', 'display.service', function (data, u, events, send, react, g, display) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div class='absolute width height'><div class='absolute width80 height80 center' id='innerplot'></div></div>",		
		link:function ($scope, element, attr) {


			var pdata = data.get("feedback");
			var total = pdata.genome;
			var spread = pdata.spread;

			var pointSize = g.isMobile() ? 4 : 2;

			var $inner = $("#innerplot");

			var plot = [];

			var zeros = [];

			for (i in total) {
				zeros[i] = 0;
			}

			var normalize = function (y) {

				var plotHeight = $inner.height();
				var dataHeight = spread.size;
				//var zero = dataHeight/2;
				var plotfactor = plotHeight/dataHeight;

				var value = plotfactor*y;

				//console.log(value);

				return value;
			}

			var point = function (x) {

				var self = this;

				self.coords = {x:x, y:0};

				// console.log("create point", self.coords);

				var container = document.createElement("div");
				$(container).addClass("absolute black-back");
				container.style.width = pointSize + "px";
				container.style.height = pointSize + "px";
				container.style.borderRadius = pointSize/2 + "px";
				container.style.left = self.coords.x + "px";
				container.style.top = normalize(self.coords.y) + "px";
				
				$inner.append(container);

				self.changeY = function (y, duration) {

					self.coords.y = y;

					$(container).animate({top:normalize(self.coords.y)}, duration);
				}

				self.destroy = function () {

					// console.log("destroy point", self.coords);

					$(container).remove();
					container = null;
				}

			}

			var destroyPlot = function () {

				console.log("destroy plot");

				for (var i in plot) {

					plot[i].destroy();
				}

				plot.length = 0;
				plot = [];
				plot = null;
			}

			var createPlot = function () {

				destroyPlot();

				plot = [];

				console.log("create plot");

				for (var i = 0; i < total; i++) {
					plot[i] = new point(i*$inner.width()/total);
					// console.log("new point", plot[i].coords);
				}
			}

			var changeplot = function (dna, duration) {

				for (i in plot) {
					plot[i].changeY((Array.isArray(dna) ? dna[i] : dna), duration);
				}
			}

			var resetPlot = function () {
				changeplot(0, 300);
			}


			display.waitForElem({elems:"#arena"}, function (options) {


				react.push({
					name:"importplot",
					state:{
						changeplot:changeplot,
						createplot:createPlot,
						resetplot:resetPlot
					}
				});

				var ed = u.correctForAspect({
					id:"plot",
					factor:0.5, 
					aspect:2, 
					width:$(window).width(), 
					height:$(window).height()
				})

				$("#arena").css({width:ed.width, height:ed.height});

			})

		}

	}

}]);