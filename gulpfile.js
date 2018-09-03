var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer'),
path = require("path"),
shell = require("gulp-shell"),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
del = require('del'),
inject = require('gulp-inject'),
filter = require("gulp-filter"),
merge = require("merge-stream"),
mainBowerFiles = require("gulp-main-bower-files"),
nodemon = require('gulp-nodemon'),
livereload = require('gulp-livereload');
sass = require("gulp-sass"),
babel = require("gulp-babel"),


webpackTask = require("./webpack.config.js").webpackTask,

babelPresets = require("./babel.config.js");

// webpackTask = require("./webpack").webpackTask;


// var middleware = require("./middleware/middleware.js");

const config = require("./config.js");


// var minify = process.env.NODE_ENV == "production";
var minify = false;

// var injectMin = process.env.NODE_ENV == "production";
var injectMin = false;


var injectJS = function () {

	var important = gulp.src('dist/assets/js/vendor' + (minify && injectMin ? ".min" : "") + '.js', {read: false});
	var standard = gulp.src(["dist/assets/js/main" + (minify && injectMin ? ".min" : "") + ".js", 'dist/assets/**/*.css'], {read:false});

	return gulp.src('src/index.html')
	.pipe(inject(important, {ignorePath:"dist", starttag: '<!-- inject:head:{{ext}} -->'}))
	.pipe(inject(standard, {ignorePath:"dist"}))
	.pipe(gulp.dest('dist'));

}


var scripts = function() {


    var mainSrc = gulp.src([
	    "src/assets/**/*.js",
	    "src/app/state/stateModule.js",
	    "src/app/state/runtimeState.js",
	    "src/app/state/states.js",
        "src/app/app.js",
        "src/app/main.controller.js",
        "src/app/services/**/*.js",
	    "src/app/directives/**/*.js",
	    "src/evolve-app/**/*.js"
    ])
	.pipe(concat('main.js'))
	.pipe(babel({
        presets: ["@babel/env"]
    }))
	.pipe(gulp.dest("dist/assets/js"));

	var mainMin;

	if (minify) {
		mainMin = mainSrc
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest("dist/assets/js"))
	}

	if (minify) {
		return merge(main, mainMin);
	}
	else {
		return mainSrc;
	}

};

var tempVendor = function () {

	// var shimFile = "node_modules/angular-polyfills/dist/all.js";
	// var shimFile = "node_modules/es6-shim/es6-shim.min.js";

	var shimFile = "node_modules/@babel/polyfill/dist/polyfill.js";


	var shim = gulp.src(shimFile)
		.pipe(concat("shim.js"))
		.pipe(gulp.dest("temp/vendor"));

	var bowerSrc = gulp.src("bower.json")
		.pipe(mainBowerFiles({base:"bower_components"}))
		.pipe(filter("**/*.js"))
		.pipe(concat("bower.js"))
		.pipe(gulp.dest("temp/vendor"));

	var npmSrc = gulp.src([
			//npm packages for front end use
			"node_modules/jquery.scrollto/jquery.scrollTo.js",
			"node_modules/velocity-animate/velocity.js",
        	"node_modules/mc-shared/shared.js"
			])
		.pipe(concat("npm.js"))
		.pipe(gulp.dest("temp/vendor"))


	return merge(shim, npmSrc, bowerSrc);
}

var vendor = function () {


	var js = gulp.src([
	                  "temp/vendor/shim.js",
	                  "temp/vendor/bower.js",
	                  "temp/vendor/**/*.js"
	                  ])
	.pipe(concat("vendor.js"))
	.pipe(gulp.dest("dist/assets/js"));

	var jsMin;

	if (minify) {
		jsMin = js
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest("dist/assets/js"));
	}

	// var css = gulp.src("./bower.json")
	// .pipe(mainBowerFiles())
	// .pipe(filter("**/*.css"))
	// .pipe(concat("vendor.css"))
	// .pipe(gulp.dest("dist/assets/css"));


	// if (minify) {
	// 	return merge(js, jsMin, css);
	// }
	// else {
	// 	return merge(js, css);
	// }

	return minify ? jsMin : js;

};

var apiSass = function () {
  return gulp.src('src/assets/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('temp/'));
}


var styles = function() {


	// middleware.compileSass();


	var cssSrc = gulp.src([
	                      'temp/**/*.css',
	                      "node_modules/@fortawesome/fontawesome-free/css/all.css"
	                      ])
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'));

	
	var css = cssSrc
	.pipe(concat("styles.css"))
	.pipe(gulp.dest('dist/assets/css'));

	return css;
};


var html = function () {

	return gulp.src('src/**/*.html')
	.pipe(gulp.dest("dist/assets/views/"))
};

var images = function() {
	return gulp.src('src/assets/img/**/*')
	.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
	.pipe(gulp.dest('dist/assets/img'));
};

var data = function() {
	return gulp.src('src/assets/data/kaggle/**/*.csv')
	.pipe(gulp.dest('dist/assets/data/kaggle'));
};

var fonts = function () {

	var mainFonts = gulp.src("src/assets/fonts/**/*.*")
	.pipe(gulp.dest("dist/assets/fonts"))

	var vendorFonts = gulp.src("node_modules/@fortawesome/fontawesome-free/webfonts/*.*")
	.pipe(gulp.dest("dist/assets/webfonts"))

	return merge(mainFonts, vendorFonts);
};

var index = function () {

	return gulp.src([ 
    "./favicon.ico"
    ]).pipe(gulp.dest("dist"));
}

var misc = function() {
	return gulp.src([
	                'src/assets/config/**/*.*'
	                ])
	.pipe(gulp.dest('dist/assets/config'));
};


var clean = function() {
	return del(['dist', "temp"]);
}


var serveFunc = function (done) {


	livereload.listen({port:config.livereloadPort});

	var stream = nodemon({ 
		script: path.join(__dirname, "server.js"),
		ext:"js html css scss json",
		watch:["./src", "./backend"],
		tasks:["build"]
	});


	stream.on("start", function () {

		done();
	})

	stream.on("restart", function () {

		setTimeout(function () {

			try {
				livereload.reload();
			}
			catch (err) {
				console.log("cannot livreload at this time", err);
			}

			done();

		}, 2000);

	})

	stream.on("crash", function () {
		
		stream.emit('restart', 10);
	})

	return stream;
	
}



// var watcher = gulp.watch('src/assets/**/*.scss', apiSass);

// watcher.on("change", function () {

// 	gulp.task(apiSass);

// 	// done();
// });


var copy = gulp.parallel(data, misc, index, html, images, fonts)

var compile = gulp.parallel(gulp.series(tempVendor, vendor), gulp.series(scripts, webpackTask));

var buildTask = gulp.series(compile, gulp.parallel(gulp.series(apiSass, styles), copy), injectJS);

var serveTask = gulp.series(clean, buildTask, serveFunc);



gulp.task("build", buildTask);

gulp.task("serve", serveTask);









