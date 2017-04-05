/* file: gulpfile.js */

var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    sass   = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect-php'),
    browserSync = require('browser-sync'),
    notify = require("gulp-notify"),
    bower = require('gulp-bower');

var config = {
   bowerDir: './bower_components'
}



/* jshint task would be here */

gulp.task('build-css', function() {
  return gulp.src('source/scss/**/*.scss')
    .pipe(sourcemaps.init()) 
    .pipe(sass())
    .pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest('public/assets/stylesheets'))
    .pipe(livereload());
});

gulp.task('build-js', function() {
  return gulp.src('source/javascript/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/javascript'))
    .pipe(livereload());
});

gulp.task('connect-sync', function() {
  connect.server({}, function (){
    browserSync({
      proxy: '127.0.0.1:8000/source'
    });
  });
 
  gulp.watch('**/*.php').on('change', function () {
    browserSync.reload();
  });

});


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
});




gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('default', ['bower', 'icons', 'build-js', 'build-css', 'connect-sync']);



