const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const config = require("./config.js");

const middleware = require("./middleware/middleware.js");

const app = express();

const evolveRoutes = require("./backend/routes/evolving.js");
const writingRoutes = require("./backend/routes/write-image.js");

const trashRoutes = require("./backend/routes/programs/trash.js");
const recognizeRoutes = require("./backend/routes/programs/recognize.js");

const get = require("./backend/evolve-app/data/get/get.js");

// console.log("livereload", config.livereloadPort);

var PORTS = {
	heroku:8080,
	http:80,
	livereload:config.livereloadPort,
	misc1:3000,
	misc2:4200,
	misc3:4210
}


app.use(middleware.refresh());
if  (process.env.NODE_ENV == "production") app.use(middleware.forceSSL());
else {console.log("environment development");}

app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));



app.use("/evolve", evolveRoutes);
app.use("/write", writingRoutes);
app.use("/trash", trashRoutes);
app.use("/recognize", recognizeRoutes);

if  (process.env.NODE_ENV != "production") {
	app.use(require('connect-livereload')({
		port: PORTS.livereload
	}));
}


app.use("/", express.static(path.join(__dirname, "dist")));


var env = process.env.NODE_ENV;
var port;

	
if (process.env.PORT) {
	port = process.env.PORT;
}
else if (env == "production") {

	port = PORTS.heroku;

}
else if (env == "development") {

	port = PORTS.misc2;
}
else {

	port = PORTS.misc1;
}



var listener = app.listen(port, function () {

	console.log("listening on port", listener.address().port);
});




