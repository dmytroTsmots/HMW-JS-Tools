var gulp = require('gulp');
var less = require('gulp-less');
var del = require('del');
var jshint = require('gulp-jshint');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpSequence = require('gulp-sequence');	
var browserSync = require('browser-sync').create();


gulp.task('hint', function() {
    return gulp.src('./src/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('copy', function () {
	gulp.src('./src/*.html')
    .pipe(gulp.dest('./prod/'))
    .pipe(browserSync.stream());
});


gulp.task('js', function () {
	gulp.src('./src/scripts/ES6/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./src/scripts/ES5/'))
        .pipe(browserSync.stream());   
});


gulp.task('less', function () {
  return gulp.src('./src/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('./prod/'))
    .pipe(browserSync.stream());
});


gulp.task('optimize', function() {
  return gulp.src('./src/scripts/ES5/*.js')
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./prod/js/'));
});


gulp.task('del',function(){
    del.sync(['./prod/']);
});


gulp.task('livereload', function() {
    browserSync.init({
        server: {
            baseDir: "prod"
        }
    });
    gulp.watch('src/css/*.less',['less']);
    gulp.watch("src/*.html",['copy']).on('change', browserSync.reload);
    gulp.watch("src/js/**/*.js",['js', 'optimize']).on('change', browserSync.reload);
});



gulp.task('prod', gulpSequence(('del',['copy', 'less', 'js', 'optimize'])));

gulp.task('server', ['prod', 'livereload']);

gulp.task('default', ['server']);