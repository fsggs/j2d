'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var del = require('del');
var st = require('st');
var opn = require('opn');

var http = require('http');

var paths = {
    scripts: ['src/js/**/*.js'],
    css: ['src/css/**/*.css'],
    images: ['src/img/**/*'],

    example: [
        'examples/2dist/index.html',
        'examples/2dist/application.js',
        'examples/2dist/style.css'
    ],
    vendor: ['libs/require.min.js', 'vendor/jquery/dist/jquery.min.js']
};

var server = {
    port: '8000'
};


/** Clean **/
gulp.task('clean', function () {
    return del(['dist']);
});

/** Developer example **/
gulp.task('example-dist', ['clean'], function () {
    gulp.src(paths.example)
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
    gulp.src(paths.vendor)
        .pipe(gulp.dest('dist/vendor'))
        .pipe(livereload());
});

/** JS Scripts **/
gulp.task('js-scripts', ['clean'], function () {
    gulp.src(paths.scripts)
        //.pipe(jshint())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(rename(function (path) {
            if (path.extname === '.js') {
                path.extname = '.min';
            }
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(rename(function (path) {
            if (path.extname === '.min') {
                path.extname = '.min.js';
            }
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(livereload());

    gulp.src(['vendor/requirejs/require.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(rename(function (path) {
            if (path.extname === '.js') {
                path.extname = '.min';
            }
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(rename(function (path) {
            if (path.extname === '.min') {
                path.extname = '.min.js';
            }
        }))
        .pipe(gulp.dest('libs'));
});

/** CSS Style **/
gulp.task('css-style', ['clean'], function () {
    gulp.src(paths.css)
        .pipe(csso())
        .pipe(rename(function (path) {
            path.extname = ".min.css"
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});

/** Images **/
gulp.task('images', ['clean'], function () {
    return gulp.src(paths.images)
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('dist/img'))
        .pipe(livereload());
});

/** Watcher **/
gulp.task('watch', ['default', 'server'], function () {
    livereload.listen({basePath: 'dist'});
    gulp.watch(paths.scripts, ['js-scripts']);
    gulp.watch(paths.css, ['css-style']);
    gulp.watch(paths.images, ['images']);

    gulp.watch(paths.example, ['example-dist']);
});

/** Server for watcher **/
gulp.task('server', function (done) {
    http.createServer(
        st({path: __dirname + '/dist', index: 'index.html', cache: false})
    ).listen(server.port, done);
    console.log('Listening on port ' + server.port);
});

/** Open browser **/
gulp.task('browser', function () {
    opn('http://127.0.0.1:' + server.port, {app: 'chrome'});
});

/** Default **/
gulp.task('default', ['js-scripts', 'css-style', 'images', 'example-dist']);
