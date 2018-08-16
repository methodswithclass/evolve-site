
app.factory("phases.service", [function () {




	var phases = [];



	var runPhase = function (i) {

		phases[i].phase();

		if (!phases[i].next && i < phases.length-1) {
			runPhase(i + 1);
		}
	}


	var run = function () {

		runPhases(0);
	}



	var loadPhases = function ($phases, run) {

		phases = $phases;


		for (var i in phases) {

			if(phases[i].button) {

	 			phases[i].button.addEventListener("click", function () {

					if (phases[i].next) phases[i].next();
				})
 			}
		}

		if (run) runPhases(0);
	}



	return {
		loadPhases:loadPhases,
		runPhase:runPhase,
		run:run
	}


}]);