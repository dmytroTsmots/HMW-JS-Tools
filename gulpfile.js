var gulp = require('gulp');
var less = require('gulp-less');
var del = require('del');
var jshint = require('gulp-jshint');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpSequence = require('gulp-sequence');	
var browserSync = require('browser-sync').create();


//This task use jshint
gulp.task('hint', function() {
    return gulp.src('./src/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//This task only copy html file to prod folder
gulp.task('copy', function () {
	gulp.src('./src/*.html')
    .pipe(gulp.dest('./prod/'))
    .pipe(browserSync.stream());
});

//This task transpile es6 code to es5 with babel
gulp.task('js', function () {
	gulp.src('./src/scripts/ES6/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./src/scripts/ES5/'))
        .pipe(browserSync.stream());   
});

//This task compile .less files to .css files
gulp.task('less', function () {
  return gulp.src('./src/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('./prod/'))
    .pipe(browserSync.stream());
});

//This task concat and minify all .js files into app.js file
gulp.task('optimize', function() {
  return gulp.src('./src/scripts/ES5/*.js')
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./prod/js/'));
});

//This task delete prod folder
gulp.task('del',function(){
    del.sync(['./prod/']);
});

//This task use browserSync to livereload browser page
gulp.task('livereload', function() {
    browserSync.init({
        server: {
            baseDir: "prod"
        }
    });
    gulp.watch('src/css/*.less',['less']);
    gulp.watch("src/*.html",['copy']).on('change', browserSync.reload);
    gulp.watch("src/scripts/**/*.js",['js', 'optimize']).on('change', browserSync.reload);
});


//Task prod for production release
gulp.task('prod', gulpSequence(('del',['copy', 'less', 'js', 'optimize'])));

//Task server for development server release (use watch)
gulp.task('server', ['prod', 'livereload']);

//Default task
gulp.task('default', ['prod']);