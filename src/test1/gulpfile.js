var gulp = require('gulp');

var concat = require('gulp-concat');

gulp.task('buildJSDependencies', function(){
	
});

gulp.task('default', function(){
	return gulp.src([
		'../../bower_components/jquery/dist/jquery.min.js',
		'../../bower_components/greensock/src/minified/TweenMax.min.js'])
		.pipe(concat('libs.min.js'))
		.pipe(gulp.dest('./scripts'));
});