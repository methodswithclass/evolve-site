var gulp = require('gulp');
var server = require('gulp-server-livereload');
var autoprefixer = require('gulp-autoprefixer'),
// cssnano = require('gulp-cssnano'),
// jshint = require('gulp-jshint'),
shell = require("gulp-shell"),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
// notify = require('gulp-notify'),
cache = require('gulp-cache'),
del = require('del'),
inject = require('gulp-inject'),
angularFilesort = require('gulp-angular-filesort'),
order = require("order"),
filter = require("gulp-filter"),
merge = require("merge-stream"),
mainBowerFiles = require("main-bower-files");


gulp.task("serve", ["watch"], shell.task("node server.js"));

gulp.task('watch', ["build"], function() {

    gulp.watch(["./src/**/*.*", "./backend/evolve/**/*.*"], ["build"]);

});



gulp.task('styles', function() {
	return gulp.src('src/assets/css/**/*.css', { style: 'expanded' })
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	// .pipe(concat("styles.css"))
	// .pipe(rename({suffix: '.min'}))
	// .pipe(uglify())
	.pipe(gulp.dest('dist/assets/css'));
});

gulp.task('scripts', ['vendor'], function() {
	return gulp.src([
	                "src/site/app/app.js",
		            "src/site/state/stateModule.js",
		            "src/ga-apps/app-recognize/app/image-processor/pixel.processor.js",
		            "src/ga-apps/app-recognize/app/image-processor/directread.js",
		            "src/ga-apps/app-recognize/app/image-processor/filereader.js",
		            "src/ga-apps/app-recognize/app/image-processor/csvreader.js",
		            "src/ga-apps/app-recognize/app/image-processor/image.processor.js",
		            "src/ga-apps/app-feedback/**/*.js",
		            "src/ga-apps/app-trash/**/*.js",
		            "src/**/*.js"
		            ])
	// .pipe(jshint('.jshintrc'))
	// .pipe(jshint.reporter('default'))
	.pipe(concat('main.js'))
	// .pipe(rename({suffix: '.min'}))
	// .pipe(uglify())
	.pipe(gulp.dest('dist/assets/js'));
});

gulp.task("vendor", function () {

	var js = gulp.src(mainBowerFiles(), { base: __dirname + '/bower_components' })
		.pipe(filter("**/*.js"))
		.pipe(concat("vendor.js"))
		// .pipe(rename({suffix: '.min'}))
		// .pipe(uglify())
		.pipe(gulp.dest("dist/assets/js"));

	var css = gulp.src(mainBowerFiles())
		.pipe(filter("**/*.css"))
		.pipe(concat("vendor.css"))
		// .pipe(rename({suffix: '.min'}))
		// .pipe(uglify())
		.pipe(gulp.dest("dist/assets/css"));

	return merge(js, css);
});

gulp.task("html", function () {

	return gulp.src('src/assets/**/*.html')
	.pipe(gulp.dest("dist/assets/"))
});

gulp.task('images', function() {
	return gulp.src('src/assets/img/**/*')
	.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
	.pipe(gulp.dest('dist/assets/img'));
});

gulp.task('data', function() {
	return gulp.src('src/assets/data/kaggle/**/*.csv')
	// .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
	.pipe(gulp.dest('dist/assets/data/kaggle'));
});

gulp.task('fonts', function () {

	return gulp.src("src/assets/css/**/*.*")
	.pipe(gulp.dest("dist/assets/css"))
});

gulp.task("misc", function () {

	return gulp.src([ 
	            "./favicon.ico"
	            ]).pipe(gulp.dest("dist"));

	// var csv = gulp.src([
	// 			"src/assets/data/kaggle/*.*"
 //                ]).pipe(gulp.dest("dist/assets/data/kaggle"))


	// return merge(fav);
})

gulp.task('index', ["styles", "scripts", 'html', "fonts", "images", "data", "misc"], function () {

	// It's not necessary to read the files (will speed up things), we're only after their paths: 
	var important = gulp.src('dist/assets/js/vendor.js', {read: false});
	var standard = gulp.src(["dist/assets/js/main.js", 'dist/assets/**/*.css'], {read:false});

	return gulp.src('src/index.html')
	.pipe(inject(important, {ignorePath:"dist", starttag: '<!-- inject:head:{{ext}} -->'}))
	.pipe(inject(standard, {ignorePath:"dist"}))
	.pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
	return del('dist');
});

gulp.task('build', ['clean'], function() {
	gulp.start("index");
});








