app.factory("config.service", ["utility", '$http', function (u, $http) {



	var self = this;

	self.config = {};




	var shared = window.shared;
	var g = shared.utility_service;
	var send = shared.send_service;
	var react = shared.react_service;
	var events = shared.events_service;


	var get = function ($key) {


		var key;
		var value;
		var prop;
		var i = 0;

		var keyArray = $key.split(".");

		var getProp = (obj, $i, array) => {

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


		if (keyArray.length == 1) {
			key = keyArray[0];

			value = self.config[key];
		}
		else {

			value = getProp(self.config, i, keyArray);
		}

		// console.log("get config return value", value, "\n\n\n");

	    return value || '';



	}



	var retrieveConfig = function () {


		return new Promise(function (resolve, reject) {


			$http({
        		method:"GET",
        		url:"/assets/config/config.json"
        	})
        	.then(function (res) {

        		// var json = JSON.parse(res);


        		// console.log("config data is", res.data);


                resolve(res.data)

            }, function (err) {

                console.log("Server error: 'config'", err.message)
            })



		})
	}


	retrieveConfig()
	.then(function (data) {

		self.config = data;
	})


	return {
		get:get
	}

}]);