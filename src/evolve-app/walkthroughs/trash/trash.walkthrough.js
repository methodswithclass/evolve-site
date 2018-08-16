app.factory("trash.walkthrough", ["utility", "phases.service", function (u, phases) {




	var phases = [
	{
		index:0,
		meta:{
			description:"Click here",
			button:""
		},
		phase:function () {


		},
		next:function () {

			
		}
	},
	{
		index:0,
		meta:{
			description:"Simulate results of 100 generations",
			button:""
		},
		phase:function () {


		},
		next:function () {

			
		}
	},
	{
		index:0,
		meta:{
			description:"Press play",
			button:""
		},
		phase:function () {


		},
		next:function () {

			
		}
	},
	{
		index:0,
		meta:{
			description:"Refresh a few times",
			button:""
		},
		phase:function () {


		},
		next:function () {

			
		}
	},
	{
		index:0,
		meta:{
			description:"",
			button:""
		},
		phase:function () {


		},
		next:function () {

			
		}
	},
	]



	var loadPhases = function () {

		phases.loadPhases(phases, false);
	}

	var run = function () {

		phases.run();
	}


	return {
		run:run
	}



}]);
