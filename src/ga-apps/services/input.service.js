app.factory("input.service", ["utility", "events.service", "global.service", 'react.service', 'config.service', function (u, events, g, react, config) {


	var self = this;


	self.global = {};
	self.temp = {};


	var crossoverMethods = config.get("types.crossoverMethods");
	var runPopTypes = config.get("types.runPopTypes");
	var reproductionTypes = config.get("types.reproductionTypes");


	var $$initial = config.get("global.initial");


	var displayTypes = {
		value:"value",
		string:"string"
	}


	var sendVars = function () {

		react.push({
			name:"evolve.vars",
			state:{
				crossoverMethods:crossoverMethods,
				reproductionTypes:reproductionTypes
			}
		})

	}


	var getValue = function ($value) {

		var value = parseFloat($value)

    	return value ? g.truncate(value/100, 2) : $value;
    }

    var getString = function ($value) {

    	var value = parseFloat($value);

    	return value ? Math.floor(value*100) : $value;
    }

    var getFloatFromId = function (id) {

    	var $value = $("#" + id + "input").val();

    	var value = parseFloat($value);

    	return value ? value : $value;
    }

    var getIntFromId = function (id) {

    	var $value = $("#" + id + "input").val();

    	var value = parseInt($value);

    	return value ? value : $value;
    }

    var resolveDisplay = function (options) {


    	var pool = parseFloat(options.pool);
    	var mutate = parseFloat(options.mutate);

    	var $pool;
    	var $mutate;


    	var types = {
    		value:"value",
    		string:"string"
    	}


    	// console.log("resolve display input", options);

		if (options.type == types.value) {

			// console.log("type value");

			$pool = pool > 1 ? getValue(pool) : pool;

			$mutate = mutate > 1 ? getValue(mutate) : mutate;

		}
		else if (options.type == types.string) {

			// console.log("type string");

			$pool = pool < 1 ? getString(pool) : pool;

			$mutate = mutate < 1 ? getString(mutate) : mutate;
 		}


 		// console.log("resolve display result", {$pool, $mutate});


    	return {
    		pool:$pool,
    		mutate:$mutate
    	}


    }

    var setValues = function (input) {

    	var values = resolveDisplay({
    		pool:input.pool,
    		mutate:input.mutate,
    		type:displayTypes.string
    	})

    	$("#gensinput").val(input.gens);
    	$("#runsinput").val(input.runs);
    	$("#popinput").val(input.pop);
    	$("#methodinput").val(input.method);
    	$("#parentsinput").val(input.parents);
    	$("#splicemininput").val(input.splicemin);
    	$("#splicemaxinput").val(input.splicemax);
    	
    	$("#poolinput").val(values.pool);
    	$("#mutateinput").val(values.mutate);

    }

    var setSettings = function ($scope, input) {

    	var values = resolveDisplay({
    		pool:input.pool,
    		mutate:input.mutate,
    		type:displayTypes.string
    	})


    	// console.log("set settings", input.pool, input.mutate, values.pool, values.mutate);

    	$scope.settings = {
        	
        	gens: 				input.gens,
        	runs: 				input.runs,
        	goal: 				"max",
        	pop:  				input.pop,
    		parents: 			input.parents,
    		pool: 				input.pool,
    		splicemin: 			input.splicemin,
    		splicemax: 			input.splicemax,

    		pool: 				values.pool,
    		mutate: 			values.mutate,
        	
        	runPopType: 		input.runPopType || self.temp.runPopType,
    		method: 			input.method || self.temp.method,
    		reproductionType: 	input.reproductionType || self.temp.reproductionType,
        
        }

        // console.log("set settings", $scope.settings);

        return $scope.settings;

    }


    var changeInput = function ($scope) {


    	var manual = {

            gens: 				$("#gensinput").val(),
            runs: 				$("#runsinput").val(),
            goal: 				"max",
            pop: 				$("#popinput").val(),
        	parents: 			$("#parentsinput").val(),
        	splicemin: 			$("#splicemininput").val(),
        	splicemax: 			$("#splicemaxinput").val(),

        	pool: 				$("#poolinput").val(),
        	mutate: 			$("#mutateinput").val(),
            
            runPopType: 		($scope.settings ? $scope.settings.runPopType || runPopTypes.default : runPopTypes.default),
        	reproductionType: 	($scope.settings ? $scope.settings.reproductionType || reproductionTypes.default : reproductionTypes.default),
        	method: 			($scope.settings ? $scope.settings.method || crossoverMethods.default : crossoverMethods.default)
        
        }

        // console.log("change input", manual);

    	return setSettings($scope, manual);
    }


 	var setInput = function (options) {

 		for (var i in options) {

 			self.temp[i] = options[i]
 		}


        for (var i in options) {

            self.global[i] = options[i];
        }

 	}


    var getInput = function (update) {

    	if (typeof update === "undefined" || typeof update === "null") update = true;
		

    	var values = resolveDisplay({
    		pool:update ? getIntFromId("pool") : self.temp.pool,
    		mutate:update ? getIntFromId("mutate") : self.temp.mutate,
    		type:displayTypes.value
    	})

    	// var $goal = $("#goalinput");
    	var $method = $("#methodinput");


		self.global = {
			
			name: 				self.temp.name || "",
			
			gens: 				update ? getIntFromId("gens") 						: self.temp.gens,
			runs: 				update ? getIntFromId("runs") 						: self.temp.runs,
			goal: 			    "max",
			pop: 				update ? getIntFromId("pop") 						: self.temp.pop,
			parents: 			update ? getIntFromId("parents") 					: self.temp.parents,
			splicemin: 			update ? getIntFromId("splicemin") 					: self.temp.splicemin,
			splicemax: 			update ? getIntFromId("splicemax") 					: self.temp.splicemax,

			pool: 				values.pool,
			mutate: 			values.mutate,
			
			runPopType: 		self.temp.runPopType || runPopTypes.default,
			method: 		    update ? $method.val()								: self.temp.method,
			reproductionType: 	self.temp.reproductionType || reproductionTypes.default,
			
			programInput: 		self.temp.programInput || {},
			session: 			self.temp.session || ""
		}

		console.log("get input", update, self.temp, self.global);

        setValues(self.global);

        return self.global;
    }


    var resendInput = function () {
    	return self.global;
    }


    var resetInput = function () {

    	sendVars();

		setInput($$initial);	
	}



	return {
		resetInput:resetInput,
		setInput:setInput,
		getInput:getInput,
		resendInput:resendInput,
		setSettings:setSettings,
		changeInput:changeInput
	}


}]);