var gulp = require('gulp');

var concat = require('gulp-concat');

var depPath = '../../bower_components';

gulp.task('buildJSDependencies', function(){
	return gulp.src([
		depPath+'/jquery/dist/jquery.min.js',
		depPath+'/gsap/src/minified/TweenMax.min.js'])
		.pipe(concat('libs.min.js'))
		.pipe(gulp.dest('./scripts'));
});

gulp.task('default', ['buildJSDependencies'], function(){
	console.log("TEST 1 BUILD COMPLETE");
});