//include gulp
var gulp = require('gulp');

//include plug-ins
var autoprefix = require('gulp-autoprefixer'),
	changed = require('gulp-changed'),
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	jshint = require('gulp-jshint'),
	minifyCSS = require('gulp-minify-css'),
	minifyHTML = require('gulp-minify-html'),
	uglify = require('gulp-uglify'),
	webserver = require('gulp-webserver');


//JS hint task
gulp.task('jshint', function(){
	gulp.src('./src/scripts/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

//minify new images
gulp.task('imagemin', function(){
	var imgSrc = './src/images/**/*',
      imgDst = './build/images';
 
  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

//minify html
gulp.task('minifyHTML', function(){
	var htmlSrc = './src/*.html',
      htmlDst = './build';
 
	gulp.src(htmlSrc)
		.pipe(changed(htmlDst))
		.pipe(minifyHTML())
		.pipe(gulp.dest(htmlDst));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src(['./src/scripts/*.js'])
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/scripts/'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src(['./src/styles/*.css'])
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/styles/'));
});

//Start webserver at localhost:8000
gulp.task('server', function () {  
  return gulp.src('build/')
    .pipe(webserver());
});

gulp.task('default', ['imagemin', 'minifyHTML', 'scripts', 'styles'], function() {
});