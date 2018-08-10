

const https = require("https");
const fs = require("fs");
const path = require("path");
const sass = require("node-sass");
const config = require("../config.js");



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


const errorHandler  = function () {

	return function (err, req, res, next) {
	  	
		console.log("error handller");

		if (err || res.statusCode >= 500) {
			res.status(200).send({error:err});
		}
		else {
			next();
		}
	}

}



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

// var file = path.join(config.basedir, "src/assets/scss/classes_local.scss");
// var outputFile = path.join(config.basedir, "src/assets/css/classes_local.css");
// var sourceMap = path.join(config.basedir, "src/assets/css/classes_local.map.css");

// var dir = path.join(config.basedir, "src/assets/scss");


// var compileSass = function () {


// 	if (!fs.existsSync(dir)){
// 	    fs.mkdirSync(dir);
// 	}


// 	// console.log("base dir", config.basedir);

// 	var fileStream = fs.createWriteStream(file);

// 	fileStream.on("open", () => {

// 		https.get("https://code.methodswithclass.com/api/classes/2.0/classes.scss", (res) => {


// 			res.on('data', (chunk) => {

//                 fileStream.write(chunk);
//             }).on("end", () => {

//             	fileStream.end();


//             	sass.render({
// 					file:file,
// 					outFile:outputFile
// 					// sourceMap:sourceMap
// 				}, (err, result) => { 

// 					if (err) {
// 						console.log("\nError while compiling Sass on server:\n\n", err);
// 					}
// 					else {
// 						console.log("\nSass compilation on server successful:\n\n", result);

// 						fs.writeFile(outputFile, result.css, (err) => {

// 							if (err) {

// 								console.log("\nError writing CSS to file to disk\n\n");
// 							}
// 							else {
// 								console.log("\nCSS file successfully written to disk\n\n");
// 							}
// 						})
// 					}
// 				});

//             }).on("error", (err) => {

//             	console.log("Error in response getting /2.0/classes.scss")
//             })

// 		});

// 	});

// }



module.exports = {
	errorHandler:errorHandler,
	forceSSL:forceSSL,
	refresh:refreshOnly,
	refreshAllBut:refreshAllBut
	// compileSass:compileSass
}



