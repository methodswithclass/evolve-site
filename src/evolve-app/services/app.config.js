app.provider("config.service", [function () {


	var shared = window.shared;
	var g = shared.utility_service;
	var events = shared.events_service;
	var react = shared.react_service;
	var send = shared.send_service;

	var p = {};

	p.config = null;

	var doesExist = function () {


		var check;
		var count = 0;
		var countMax = 500;
		var duration = 30;
		var result = false;

		var checkConfig = function () {

			return p.config && Object.keys(p.config).length > 0;
		}

		// console.log("does exist", p.config);

		if (checkConfig()) result = true;
		else {

			check = setInterval(function() {

				if (checkConfig() || count >= countMax) {

					clearInterval(check);
					check = null;
					check = {};

					if (count < countMax) {
						result = true;
					}
					else {
						console.log("config check failed: timeout " + count*countMax*duration/1000 + " seconds");
						result = false;
					}

				}

				count++;

			}, duration)

		}

		return result;

	}


	var getConfig = function ($key) {


		var key;
		var value;
		var prop;
		var i = 0;

		var keyArray = $key.split(".");

		var getProp = function (obj, $i, array) {

			if ($i < array.length-1) {

				prop = array[$i]

				if (obj.hasOwnProperty(prop)) {

					// console.log("get prop", $i, obj, prop, obj[prop]);
					return getProp(obj[prop], $i + 1, array);
				}
				else {
					return '';
				}

			}
			else {
				return obj[array[$i]];
			}
		}


		value = getProp(p.config, i, keyArray);

	    return value || '';

	}


	var retrieveConfig = function () {

		// console.log("retrieve config");

		return new Promise(function (resolve, reject) {

   			if (!doesExist()) {
	   			
	   			$.ajax("/assets/config/config.json", 
	   			{
	   				method:"GET"
	   			})
	   			.then(function (data) {
	   				console.log("response data", data);
	   				resolve(data);
	   			}, function (err) {

	   				console.log("Server error: 'config'", err.message)
	   			})
   			}
   			else {
   				resolve(p.config);
   			}


		})
	}


	var assignConfig = function () {

		return retrieveConfig()
		.then(function (data) {

			p.config = data;

		})
	}


	var get = function ($$key) {

		var processConfig = function (_key, resolve, reject) {

			var resultArray = [];

			if (Array.isArray(_key)) {
				
				for (var i in _key) {

					resultArray.push(getConfig(_key[i]));
				}

				resolve(resultArray);
			}
			else {

				resolve(getConfig(_key));
			}
		}

		return assignConfig()
		.then(function () {

			return new Promise(function ($resolve, $reject) {

				// console.log("get", $$key);
				if (doesExist()) {
					return processConfig($$key, $resolve, $reject);
				}
				else {
					return null;
				}
			})

		})

	}


	p.$get = ["utility", function (u) {

		

		var service = function () {

			return {
				get:get
			}
		}

		return new service();

	}]

	p.get = get;
	p.assignConfig = assignConfig;


	return p;

}]);