'use strict';

var gulp = require('gulp');
var debug = require('gulp-debug')

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var livereload = require('gulp-livereload');

gulp.task('js', function() {
    return browserify({
        entries: ['./assets/js/main.js'],
        debug: true
    })

        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./web/assets/js/'));
});

gulp.task('css', ['copy'], function () {
    return gulp.src('./assets/css/main.scss')
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest('./web/assets/css'));
});

/*
gulp.task('icomoon', function () {
    return gulp.src('./assets/icomoon/**')
        .pipe(gulp.dest('./web/assets/icomoon'));
});
*/

gulp.task('foundation-icons', function () {
    return gulp.src('./assets/foundation-icons/**')
        .pipe(gulp.dest('./web/assets/foundation-icons'));
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('./assets/js/**/*.js', ['js']);
    gulp.watch('./assets/css/**/*.scss', ['css']);
    /*
    gulp.watch('./assets/icomoon/**', ['icomoon']);
    */
    gulp.watch('./assets/foundation-icons/**', ['foundation-icons']);
    gulp.watch('./web/assets/**').on('change', livereload.changed);
});

gulp.task('copy', [/*'icomoon', */'foundation-icons']);

gulp.task('build', ['copy', 'css', 'js']);

gulp.task('default', ['watch', 'build']);
