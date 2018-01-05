app.factory("input.service", ["utility", "events.service", "global.service", 'react.service', 'config.service', function (u, events, g, react, config) {


	var self = this;


	self.global = {};
	self.temp = {};


	var crossoverMethods = config.get("types.crossoverMethods");
	var runPopTypes = config.get("types.runPopTypes");
	var reproductionTypes = config.get("types.reproductionTypes");


	var $$initial = config.get("global.initial");


	setTimeout(function () {


		react.push({
			name:"evolve.vars",
			state:{
				crossoverMethods:crossoverMethods,
				reproductionTypes:reproductionTypes
			}
		})

	}, 500);


	var getValue = function (value) {

    	return parseFloat(value/100)
    }

    var getString = function (value) {

    	return value ? Math.floor(value*100) : "";
    }

    var getFloatFromId = function () {

    	return parseFloat($("#" + id + "input").val());
    }

    var getIntFromId = function (id) {

    	return parseInt($("#" + id + "input").val());
    }

    var setSettings = function ($scope, input) {

    	$scope.settings = {
        	gens: 				input.gens,
        	runs: 				input.runs,
        	goal: 				input.goal,
        	pop:  				input.pop,
    		parents: 			input.parents,
    		pool: 				getString(input.pool),
    		splicemin: 			input.splicemin,
    		splicemax: 			input.splicemax,
    		mutate: 			getString(input.mutate),
        	runPopType: 		input.runPopType || self.temp.runPopType,
    		method: 			input.method || self.temp.method,
    		reproductionType: 	input.reproductionType || self.temp.reproductionType,
        }

        return $scope.settings;

    }


 	var setInput = function (options) {

 		for (var i in options) {

 			self.temp[i] = options[i]
 		}


 		// console.log("set input", options, self.temp);


 		getInput(false);

 	}


    var getInput = function (update) {

    	if (typeof update === "undefined" || typeof update === "null") update = true;


		self.global = {
			name: 				self.temp.name || "",
			gens: 				update ? getIntFromId("gens") 					: self.temp.gens,
			runs: 				update ? getIntFromId("runs") 					: self.temp.runs,
			goal: 				update ? getIntFromId("goal") 					: self.temp.goal,
			pop: 				update ? getIntFromId("pop") 					: self.temp.pop,
			parents: 			update ? getIntFromId("parents") 				: self.temp.parents,
			pool: 				update ? getValue(getIntFromId("pool")) 		: self.temp.pool,
			splicemin: 			update ? getIntFromId("splicemin") 				: self.temp.splicemin,
			splicemax: 			update ? getIntFromId("splicemax") 				: self.temp.splicemax,
			mutate: 			update ? getValue(getIntFromId("mutate")) 	: self.temp.mutate,
			runPopType: 		self.temp.runPopType || runPopTypes.default,
			method: 			self.temp.method || crossoverMethods.default,
			reproductionType: 	self.temp.reproductionType || reproductionTypes.default,
			programInput: 		self.temp.programInput || {},
			session: 			self.temp.session || ""
		}

        return self.global;
    }

    var resendInput = function () {
    	return self.global;
    }


	setInput($$initial);


	return {
		setInput:setInput,
		getInput:getInput,
		resendInput:resendInput,
		setSettings:setSettings
	}


}]);