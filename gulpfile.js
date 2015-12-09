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
var fs = require('fs');
var opn = require('opn');

var concat = require('gulp-concat');
var header = require('gulp-header');
var replace = require('gulp-replace');

var http = require('http');

var paths = {
    scripts: [
        'src/js/**/*.js'
    ],
    scriptsCompile: [
        'src/js/vanilla.override.js',
        'src/js/j2d/j2d.frame.js',
        'src/js/j2d/j2d.scene.js',
        'src/js/j2d/j2d.layers.js',
        'src/js/jquery.j2d.js',
        'src/js/**/*.js'
    ],
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
gulp.task('example-dist', [], function () {
    gulp.src(paths.example)
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
    gulp.src(paths.vendor)
        .pipe(gulp.dest('dist/vendor'))
        .pipe(livereload());
});

/** JS Scripts **/
gulp.task('compile-script', [], function () {
    gulp.src(paths.scriptsCompile)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('jquery.j2d.all.js'))
        .pipe(uglify())
        .pipe(header(fs.readFileSync('src/header.js', 'utf8')))
        .pipe(sourcemaps.write('./'))
        .pipe(rename(function (path) {
            if (path.basename.substr(path.basename.length - 4) !== '.min' && path.extname === '.js') {
                path.basename += '.min';
            }
            if (path.basename.substr(path.basename.length - 3) === '.js' && path.extname === '.map') {
                path.basename = path.basename.slice(0, path.basename.length - 3) + '.min';
            }
        }))
        .pipe(replace('.js.map', '.min.map'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('js-scripts', [], function () {
    gulp.src(paths.scripts)
        //.pipe(jshint())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(header(fs.readFileSync('src/header.js', 'utf8')))
        .pipe(sourcemaps.write('./'))
        .pipe(rename(function (path) {
            if (path.basename.substr(path.basename.length - 4) !== '.min' && path.extname === '.js') {
                path.basename += '.min';
            }
            if (path.basename.substr(path.basename.length - 3) === '.js' && path.extname === '.map') {
                path.basename = path.basename.slice(0, path.basename.length - 3) + '.min';
            }
        }))
        .pipe(replace('.js.map', '.min.map'))
        .pipe(gulp.dest('dist/js'))
        .pipe(livereload());

    gulp.src(['vendor/requirejs/require.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify({preserveComments: 'license'}))
        .pipe(sourcemaps.write('./'))
        .pipe(rename(function (path) {
            if (path.basename.substr(path.basename.length - 4) !== '.min' && path.extname === '.js') {
                path.basename += '.min';
            }
            if (path.basename.substr(path.basename.length - 3) === '.js' && path.extname === '.map') {
                path.basename = path.basename.slice(0, path.basename.length - 3) + '.min';
            }
        }))
        .pipe(replace('.js.map', '.min.map'))
        .pipe(gulp.dest('libs'));
});

/** CSS Style **/
gulp.task('css-style', [], function () {
    gulp.src(paths.css)
        .pipe(csso())
        .pipe(rename(function (path) {
            path.extname = ".min.css"
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});

/** Images **/
gulp.task('images', [], function () {
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
gulp.task('browser-chrome', function () {
    opn('http://127.0.0.1:' + server.port, {app: 'chrome'});
});

gulp.task('browser-firefox', function () {
    opn('http://127.0.0.1:' + server.port, {app: 'firefox'});
});

/** Make **/
gulp.task('make', ['clean'], function () {
    gulp.start('js-scripts');
    gulp.start('compile-script');
    gulp.start('css-style');
    gulp.start('images');
    gulp.start('example-dist');
});

/** Default **/
gulp.task('default', ['make']);
