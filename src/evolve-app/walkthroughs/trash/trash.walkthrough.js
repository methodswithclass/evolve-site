app.factory("trash.walkthrough", ["utility", "phases.service", function (u, phases) {




	var $phases = [
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
		index:1,
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
		index:2,
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
		index:3,
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
		index:4,
		meta:{
			description:"Scroll up to evolve more generations",
			button:""
		},
		phase:function () {


		},
		next:function () {

			
		}
	},
	{
		index:5,
		meta:{
			description:"Click here",
			button:""
		},
		phase:function () {


		},
		next:function () {

			
		}
	}
	]



	var loadPhases = function () {

		phases.loadPhases($phases, false);
	}

	var run = function () {

		phases.run();
	}


	loadPhases();


	return {
		run:run
	}



}]);
