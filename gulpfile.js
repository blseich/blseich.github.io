//include gulp
var gulp = require('gulp');

//include plug-ins
var autoprefix = require('gulp-autoprefixer'),
	changed = require('gulp-changed'),
	chug = require('gulp-chug'),
	concat = require('gulp-concat'),
	eventStream = require('event-stream'),
	fs = require('fs'),
	imagemin = require('gulp-imagemin'),
	jshint = require('gulp-jshint'),
	minifyCSS = require('gulp-minify-css'),
	minifyHTML = require('gulp-minify-html'),
	path = require('path'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	webserver = require('gulp-webserver');

var srcPath = './src/',
	dstPath = './build/';

//Function for concating js and css in specific folders
//This aides in maintaining cleaner app environments and 
//easily removable applications
function getFolders(dir) {
	return fs.readdirSync(dir)
		.filter(function(file){
			return fs.statSync(path.join(dir, file)).isDirectory();
		});
}


function buildFolderContent(func){
	var folders = getFolders(srcPath);
	var tasks = folders.map(func);
	return eventStream.concat.apply(null, tasks);
}

//JS hint task
gulp.task('jshint', function(){
	gulp.src('./src/**/scripts/*[^.min].js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

//minify new images
gulp.task('imagemin', function(){
  var assetBuild = function(folder) {
  	return gulp.src(path.join(srcPath, folder, 'assets/**/*'))
    	.pipe(changed(dstPath + folder + '/assets'))
    	.pipe(imagemin())
    	.pipe(gulp.dest(dstPath + folder + '/assets'));
	};
	return buildFolderContent(assetBuild);
});

//minify html
gulp.task('minifyHTML', function(){
	var htmlBuild = function(folder) {
		return gulp.src(path.join(srcPath, folder, '/*.html'))
			.pipe(changed(dstPath + folder))
			.pipe(minifyHTML())
			.pipe(gulp.dest(dstPath + folder));
	};
	return buildFolderContent(htmlBuild);
	
});


// JS concat, strip debugging and minify
gulp.task('scripts', ['jshint'], function() {
	var jsBuild = function(folder){
		return gulp.src([path.join(srcPath, folder, "scripts/libs.min.js"), path.join(srcPath, folder, 'scripts/*.js')])
			.pipe(concat(folder + '.js'))
        	.pipe(gulp.dest(dstPath + folder + '/scripts'))
        	.pipe(uglify())
        	.pipe(rename(folder + '.min.js'))
        	.pipe(gulp.dest(dstPath + folder + '/scripts'));
	};
	return buildFolderContent(jsBuild);
});


// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  var cssBuild = function(folder) {
  	return gulp.src(path.join(srcPath, folder, 'styles/*.css'))
    	.pipe(concat(folder + '.css'))
    	.pipe(autoprefix('last 2 versions'))
    	.pipe(minifyCSS())
    	.pipe(gulp.dest(dstPath + folder + '/styles'));
    };
    return buildFolderContent(cssBuild);
});

//Start webserver at localhost:8000
gulp.task('server', function () {  
  return gulp.src('build/')
    .pipe(webserver());
});

gulp.task('runProjectBuild', function(){
	return gulp.src('./src/**/gulpfile.js')
		.pipe(chug());
});

gulp.task('default', ['runProjectBuild', 'imagemin', 'minifyHTML', 'scripts', 'styles'], function() {
});