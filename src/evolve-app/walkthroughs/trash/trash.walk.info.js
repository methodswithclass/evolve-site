app.directive("trashInfo", function () {

	return {
		template:`



			<div class="relative width80 hcenter padding-v-100">
				<ol>
					<li>Tap the animating New button to the left at the top of the controls to regenerate a new trash configuration <br>(a good plan will work just as well on any trash configuration, it's relative to the robot, not the grid)</li>
					<li>Rerun the simulation</li>
				</ol>

				<br><br>

				<ul>
					<li>Repeat these steps a few times to get a good sense for how well your plan fares</li>

					<li>Then evolve more generations (usually about a 1000 or more) until you reach the maximum fitness (points) for the grid size to see the most intelligent result</li>
					<li>The max points for the grid size is: (trash percentage) x (numer of grid squares) x (10 points for a successful trash pickup)</li>
				</ul>
			</div>


		`
	}
})