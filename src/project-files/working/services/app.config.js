app.factory("config.service", ["utility", '$http', function (u, $http) {



	var self = this;

	self.config = {};


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

	    return value || '';



	}



	var retrieveConfig = function () {


		return new Promise(function (resolve, reject) {


			$http({
        		method:"GET",
        		url:"/assets/config/config.json"
        	})
        	.then(function (res) {

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