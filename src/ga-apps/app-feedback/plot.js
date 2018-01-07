app.directive("plot", ['data', 'utility', 'events.service', 'send.service', 'react.service', function (data, u, events, send, react) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div class='absolute width height'><div class='absolute width80 height80 center' id='innerplot'></div></div>",		
		link:function ($scope, element, attr) {


			var pdata = data.get("feedback");
			var total = pdata.genome;
			var spread = pdata.spread;

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

				var container = document.createElement("div");
				$(container).addClass("absolute black-back");
				container.style.width = "2px";
				container.style.height = "2px";
				container.style.borderRadius = "1px";
				container.style.left = self.coords.x + "px";
				container.style.top = normalize(self.coords.y) + "px";
				
				$inner.append(container);

				self.changeY = function (y, duration) {

					self.coords.y = y;

					$(container).animate({top:normalize(self.coords.y)}, duration);
				}

			}

			var createPlot = function () {

				for (var i = 0; i < total; i++) {
					plot[i] = new point(i*$inner.width()/total);
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

			events.on("createPlot", createPlot);
			
			events.on("resetPlot", function () {

				resetPlot();
			});

			react.push({
				name:"importplot",
				state:changeplot
			});

			setTimeout(function () {

				// var effdim = u.dim(2);

				var ed = u.correctForAspect({
					id:"plot",
					factor:0.8, 
					aspect:2, 
					width:$(window).width(), 
					height:$(window).height(),
					window:true
				})

				$("#arena").css({width:ed.width, height:ed.height});

			}, 500);

		}

	}

}]);