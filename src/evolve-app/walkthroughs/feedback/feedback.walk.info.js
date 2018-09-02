app.directive("feedbackInfo", function () {

	return {
		template:`


			<div class="relative width80 hcenter padding-v-100">

				What you're seeing is a series of generations pass.<br><br> 

				With each animation step, the top performing individual is displayed in the box<br><br>

				Each top performing indvidual of the generation is animated seamlessly into the next, you are not seeing a single "individual" evolve<br><br>

				You are seeing the algorithm act on the problem in real time<br><br>

				By the "top performing individual", what we mean, in this scenario, is that the whole set of dots are "closer" (determined by a calculation) to the centerline than any other like it. The closer all the dots are to the centerline, the "better performing" the "individual" is determined to be

			</div>

		`
	}
})