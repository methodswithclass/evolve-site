app.factory("input.service", ["utility", 'config.service', function (u, config) {


	var self = this;


    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;



	self.global = {};
	self.temp = {};

    self.name;

    var _$scope = {};


    var processTypes = config.get("types.processTypes")
	var crossoverMethods = config.get("types.crossoverMethods");
	var runPopTypes = config.get("types.runPopTypes");
	var reproductionTypes = config.get("types.reproductionTypes");

	var $$master_initial = config.get("global.initial");
    var $$reset_initial = config.get("global.initial");

	var displayTypes = {
		value:"value",
		string:"string"
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

		if (options.type == types.value) {

			$pool = pool > 1 ? getValue(pool) : pool;
			$mutate = mutate > 1 ? getValue(mutate) : mutate;

		}
		else if (options.type == types.string) {

			$pool = pool < 1 ? getString(pool) : pool;
			$mutate = mutate < 1 ? getString(mutate) : mutate;
 		}

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

    var setSettings = function (input) {

    	var values = resolveDisplay({
    		pool:input.pool,
    		mutate:input.mutate,
    		type:displayTypes.string
    	})


    	_$scope.settings = {
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
            method:             input.method || crossoverMethods.default,

        	runPopType: 		input.runPopType || self.temp[self.name].runPopType,
    		reproductionType: 	input.reproductionType || self.temp[self.name].reproductionType
        }


        // console.log("set settings", _$scope.settings);

        return _$scope.settings;

    }

    var getSettings = function () {

        return _$scope.settings;
    }


    var changeInput = function (method) {

        console.log("change input", method);

    	var manual = {
            gens: 				$("#gensinput").val(),
            runs: 				$("#runsinput").val(),
            pop: 				$("#popinput").val(),
        	parents: 			$("#parentsinput").val(),
        	splicemin: 			$("#splicemininput").val(),
        	splicemax: 			$("#splicemaxinput").val(),
        	pool: 				$("#poolinput").val(),
        	mutate: 			$("#mutateinput").val(),
        	method: 		    (method ? method 
                           : (self.global[self.name].method ? self.global[self.name].method : crossoverMethods.default))
        }


    	return setSettings(manual);
    }


    var createInput = function (name) {

        self.name = name;
        self.global[self.name] = {};
        self.temp[self.name] = {};

        react.subscribe({
            name:"scope" + self.name,
            callback:function(x) {

                _$scope = x;
            }
        })
    }


    var setName = function (name) {

        self.name = name;
    }

    var resolveKeysForInitialInput = function (key) {

        return key != "gens" && key != "name" && key != "session" && key != "programInput"
    }


 	var setInput = function (options) {

        if (g.doesExist(self.temp[self.name]) && g.doesExist(self.global[self.name])) {

     		for (var i in options) {

                if (resolveKeysForInitialInput(i)) $$reset_initial[i] = options[i];
     			self.temp[self.name][i] = options[i];
                self.global[self.name][i] = options[i];
     		}

        }

 	}


    var getInput = function (update, resend) {

    	if (typeof update === "undefined" || typeof update === "null") update = true;
		

    	var values = resolveDisplay({
    		pool:update ? getIntFromId("pool") : self.temp[self.name].pool,
    		mutate:update ? getIntFromId("mutate") : self.temp[self.name].mutate,
    		type:displayTypes.value
    	})


    	var $method = $("#methodinput");

        if (resend) {
            return self.global[self.name];
        }

		self.global[self.name] = {
			
			name: 				self.name,

			gens: 				update ? getIntFromId("gens") 						: self.temp[self.name].gens,
			runs: 				update ? getIntFromId("runs") 						: self.temp[self.name].runs,
			pop: 				update ? getIntFromId("pop") 						: self.temp[self.name].pop,
			parents: 			update ? getIntFromId("parents") 					: self.temp[self.name].parents,
			splicemin: 			update ? getIntFromId("splicemin") 					: self.temp[self.name].splicemin,
			splicemax: 			update ? getIntFromId("splicemax") 					: self.temp[self.name].splicemax,
            method:             update ? $method.val()                              : crossoverMethods.default,

            pool:               values.pool,
            mutate:             values.mutate,
            goal:               "max",

			runPopType: 		self.temp[self.name].runPopType || runPopTypes.default,
			reproductionType: 	self.temp[self.name].reproductionType || reproductionTypes.default,
			programInput: 		self.temp[self.name].programInput || {},
			session: 			self.temp[self.name].session || ""
		}


        react.push({
            name:"data" + self.name,
            state:{
                input:self.global[self.name]
            }
        })


        setValues(self.global[self.name]);

        return self.global[self.name];
    }


    var resendInput = function () {
    	return self.global[self.name];
    }


    var resetInput = function () {

		setInput($$reset_initial);	
	}

    var masterReset = function () {

        setInput($$master_initial);
    }



	return {
        createInput:createInput,
        setName:setName,
		resetInput:resetInput,
        masterReset:masterReset,
		setInput:setInput,
		getInput:getInput,
        getSettings:getSettings,
		resendInput:resendInput,
		setSettings:setSettings,
		changeInput:changeInput
	}


}]);


