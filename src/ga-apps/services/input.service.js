app.factory("input.service", ["utility", "events.service", "global.service", 'react.service', 'config.service', function (u, events, g, react, config) {


	var self = this;


	self.global = {};
	self.temp = {};

    self.name;


	var crossoverMethods = config.get("types.crossoverMethods");
	var runPopTypes = config.get("types.runPopTypes");
	var reproductionTypes = config.get("types.reproductionTypes");

	var $$initial = config.get("global.initial");

	var displayTypes = {
		value:"value",
		string:"string"
	}


	// var sendVars = function () {

	// 	react.push({
	// 		name:"evolve.vars",
	// 		state:{
	// 			crossoverMethods:crossoverMethods,
	// 			reproductionTypes:reproductionTypes
	// 		}
	// 	})

	// }


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
    	$("#parentsinput").val(input.parents);
    	$("#splicemininput").val(input.splicemin);
    	$("#splicemaxinput").val(input.splicemax);
    	$("#poolinput").val(values.pool);
    	$("#mutateinput").val(values.mutate);
        $("#methodinput").val(input.method);

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
        	pop:  				input.pop,
    		parents: 			input.parents,
    		pool: 				input.pool,
    		splicemin: 			input.splicemin,
    		splicemax: 			input.splicemax,
    		pool: 				values.pool,
    		mutate: 			values.mutate,
            goal:               "max",
            method:             input.method || self.temp[self.name].method,

        	runPopType: 		input.runPopType || self.temp[self.name].runPopType,
    		reproductionType: 	input.reproductionType || self.temp[self.name].reproductionType
        }

        // console.log("set settings", $scope.settings);

        return $scope.settings;

    }


    var changeInput = function ($scope) {


    	var manual = {
            gens: 				$("#gensinput").val(),
            runs: 				$("#runsinput").val(),
            pop: 				$("#popinput").val(),
        	parents: 			$("#parentsinput").val(),
        	splicemin: 			$("#splicemininput").val(),
        	splicemax: 			$("#splicemaxinput").val(),
        	pool: 				$("#poolinput").val(),
        	mutate: 			$("#mutateinput").val(),
        	method: 			($scope.settings ? ($scope.settings.method || crossoverMethods.default) : crossoverMethods.default)
        }

        // console.log("change input", manual);

    	return setSettings($scope, manual);
    }


    var createInput = function (name) {

        self.name = name;
        self.global[self.name] = {};
        self.temp[self.name] = {};
    }


    var setName = function (name) {

        self.name = name;
    }


 	var setInput = function (options) {

        console.log("set input", self.name, options);

 		for (var i in options) {

 			self.temp[self.name][i] = options[i]
 		}


        for (var i in options) {

            self.global[self.name][i] = options[i];
        }

 	}


    var getInput = function (update) {

    	if (typeof update === "undefined" || typeof update === "null") update = true;
		

    	var values = resolveDisplay({
    		pool:update ? getIntFromId("pool") : self.temp[self.name].pool,
    		mutate:update ? getIntFromId("mutate") : self.temp[self.name].mutate,
    		type:displayTypes.value
    	})


    	var $method = $("#methodinput");


		self.global[self.name] = {
			
			name: 				self.name,

			gens: 				update ? getIntFromId("gens") 						: self.temp[self.name].gens,
			runs: 				update ? getIntFromId("runs") 						: self.temp[self.name].runs,
			pop: 				update ? getIntFromId("pop") 						: self.temp[self.name].pop,
			parents: 			update ? getIntFromId("parents") 					: self.temp[self.name].parents,
			splicemin: 			update ? getIntFromId("splicemin") 					: self.temp[self.name].splicemin,
			splicemax: 			update ? getIntFromId("splicemax") 					: self.temp[self.name].splicemax,
            method:             update ? $method.val()                              : self.temp[self.name].method,

            pool:               values.pool,
            mutate:             values.mutate,
            goal:               "max",

			runPopType: 		self.temp[self.name].runPopType || runPopTypes.default,
			reproductionType: 	self.temp[self.name].reproductionType || reproductionTypes.default,
			programInput: 		self.temp[self.name].programInput || {},
			session: 			self.temp[self.name].session || ""
		}

		// console.log("get input", update, self.temp[self.name], self.global[self.name]);

        setValues(self.global[self.name]);

        return self.global[self.name];
    }


    var resendInput = function () {
    	return self.global[self.name];
    }


    var resetInput = function () {

    	// sendVars();

		setInput($$initial);	
	}



	return {
        createInput:createInput,
        setName:setName,
		resetInput:resetInput,
		setInput:setInput,
		getInput:getInput,
		resendInput:resendInput,
		setSettings:setSettings,
		changeInput:changeInput
	}


}]);