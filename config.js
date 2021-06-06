

var gulp = require("gulp");
var merge = require("merge-stream");
var imagemin = require('gulp-imagemin');


var reporters = [
{
	index:0,
	name:"custom"
},
{
	index:1,
	name:"stylish"
}
]

var whichReporter = 1;

var htmlDest = "dist/assets/views/";

var mainScripts = [
    "src/assets/js/supporting-code.js",
    "src/app/state/stateModule.js",
    "src/app/state/runtimeState.js",
    "src/app/state/states.js",
    "src/app/app.js",
    "src/app/main.controller.js",
    "src/app/services/**/*.js",
    "src/app/directives/**/*.js",
    "src/evolve-app/services/api.http.service.js",
    "src/evolve-app/services/api.ws.service.js",
    "src/evolve-app/services/api.service.js",
    "src/evolve-app/**/*.js",
    "src/assets/js/parallax-5.0.js",
    "src/assets/js/**/*.js",
    "!src/**/*.spec.js"
]


var sassStyles = [
	"src/assets/css/classes.scss",
	"src/assets/css/styles.scss"
]

var cssStyles = [
	'temp/**/*.css',
	"node_modules/@fortawesome/fontawesome-free/css/all.css"
]


var shimFile = "node_modules/@babel/polyfill/dist/polyfill.js";


var vendorScripts = [
	//npm packages for front end use
	"node_modules/jquery.scrollto/jquery.scrollTo.js",
	"node_modules/velocity-animate/velocity.js",
	"node_modules/@methodswithclass/shared/dist/shared.js"
]


var miscSrc = function () {

	var src1 = gulp.src([
		'src/assets/config/**/*.*',
	])
	.pipe(gulp.dest("dist/assets/config/"))

	var src2 = gulp.src([
		'src/assets/data/kaggle/**/*.csv'
	])
	.pipe(gulp.dest("dist/assets/data/"))


	return merge(src1, src2);
	
}

// var minify = process.env.NODE_ENV == "production";

var minify = {
	main:{
		full:{
			make:true,
			inject:false
		},
		min:{
			make:true,
			inject:true
		}
	},
	vendor:{
		full:{
			make:true,
			inject:true
		},
		min:{
			make:false,
			inject:false
		}
	}
}



var livereloadPort = 3050;


module.exports = {
	gulp:{
		shimFile:shimFile,
		htmlDest:htmlDest,
		mainScripts:mainScripts,
		vendorScripts:vendorScripts,
		sassStyles:sassStyles,
		cssStyles:cssStyles,
		miscSrc:miscSrc,
		minify:minify,
		reporters:reporters,
		reporter:whichReporter
	},
	livereloadPort:livereloadPort
}



