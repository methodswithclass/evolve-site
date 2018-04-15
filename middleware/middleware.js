






var refreshPages = [
	"home",
	"p",
	"admin"
]



var subPages = [
	"assets",
	"favicon.ico",
	"index.html"
]




const forceSSL = function() {
	
	return function (req, res, next) {
		
		if (req.headers['x-forwarded-proto'] !== 'https') {
			return res.redirect(['https://', req.get('Host'), req.url].join(''));
		}
		
		next();
	}
}





var refreshOnly = function () {

	return function (req, res, next) {


		var urlArray = req.url.split("/");


		for (var i in refreshPages) {
			if (urlArray[1] == refreshPages[i]) {
				return res.redirect(['http://', req.get('Host')].join(''));
			}
		}

		next();

	}
}




var refreshAllBut = function () {


	return function (req, res, next) {


		var urlArray = req.url.split("/");


		subPages.map(function (value, index) {

			if (urlArray && (urlArray.length > 0 && (urlArray[1].length > 0 && urlArray[1] != value)))  {
				return res.redirect(['http://', req.get('Host')].join(''));
			}

		})

		next();

	}
}





module.exports = {
	forceSSl:forceSSL,
	refresh:refreshOnly,
	refreshAllBut:refreshAllBut
}



