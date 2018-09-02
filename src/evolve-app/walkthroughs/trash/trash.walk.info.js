app.directive("trashInfo", function () {

	return {
		template:`



			<div class="relative width80 hcenter padding-v-100">
				<ol>
					<li>{{action}} the animating New button to the left at the top of the controls to generate a new trash configuration
						<ul>
							<li>a good plan will work just as well on any trash configuration, it's relative to the robot, not the grid</li>
						</ul>
					</li>
					<li>Rerun the simulation</li>
				</ol>

				<br><br>

				<ul>
					<li>Repeat these steps a few times to get a good sense for how well your plan fares</li>

					<li>Then evolve more generations (usually about a 1000 or more) until you reach the maximum fitness (score) for the grid size to see the most intelligent result</li>
				</ul>

				<ul>
					<li>The max fitness for the grid size is: (trash percentage) x (number of grid squares) x (10 points for a successful trash pickup)</li>
					<li>So for a 5x5 grid with 50% trash, the max fitness possible is (50%)x(25 squares)x10=120 (rounded down) 
				</ul>
			</div>


		`,
		link:function ($scope) {

			var s = window.shared;
			var g = s.utility_service;
			var send = s.send_service;
			var react = s.react_service;
			var events = s.events_service;


			$scope.action = g.isMobile() ? "Tap" : "Click";
		}
	}
})