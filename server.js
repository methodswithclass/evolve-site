const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

const evolveRoutes = require("./backend/routes/evolving.js");
const writingRoutes = require("./backend/routes/write-image.js");

const trashRoutes = require("./backend/routes/programs/trash.js");
const recognizeRoutes = require("./backend/routes/programs/recognize.js");


var refreshPages = [
"home",
"p"
]



// // If an incoming request uses
// // a protocol other than HTTPS,
// // redirect that request to the
// // same url but with HTTPS
const forceSSL = function() {
	return function (req, res, next) {
		if (req.headers['x-forwarded-proto'] !== 'https') {
			return res.redirect(['https://', req.get('Host'), req.url].join(''));
		}
		next();
	}
}

var refresh = function () {

	return function (req, res, next) {

		console.log(req.url);

		var urlArray = req.url.split("/");

		for (var i in refreshPages) {
			if (urlArray[1] == refreshPages[i]) {
				return res.redirect(['http://', req.get('Host')].join(''));
			}
		}

		next();

	}
}



app.use(refresh());
if  (process.env.NODE_ENV == "production") app.use(forceSSL());
else {console.log("environment development");}


app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));



app.use("/evolve", evolveRoutes);
app.use("/write", writingRoutes);
app.use("/trash", trashRoutes);
app.use("/recognize", recognizeRoutes);
app.use("/", express.static(path.join(__dirname, "dist")));



var listener = app.listen(process.env.NODE_ENV == "production" ? (process.env.PORT || 8080) : 443, function () {

	console.log("listening on port", listener.address().port);
});




