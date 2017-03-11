import gulp from "gulp";
import concat from "gulp-concat";
import sort from "gulp-sort-amd";
import source from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import header from "gulp-header";
import csso from "gulp-csso";
import rename from "gulp-rename";
import imagemin from "gulp-imagemin";
import babel from "gulp-babel";
import clean from "gulp-clean";
import fs from "fs";

let moduleMap = JSON.parse(fs.readFileSync('src/module.json', 'utf8'));

let config = {
    input: 'src/js/**/*.es6',
    output: 'j2d.js',
    cssSources: ['src/css/j2d.css'],
    imgSources: ['src/img/*.*'],
    exampleSources: [
        'libs/require.min.js',
        'libs/require.min.map',
        'src/application.js',
        'src/index.html',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery/dist/jquery.min.map'
    ]
};

gulp.task('babel:build', () => {
    return gulp.src(config.input)
        .pipe(source.init())
        .pipe(babel({
            babelrc: false,
            moduleIds: true,
            presets: [['es2015', {
                modules: false
            }]],
            plugins: [
                ['transform-runtime', {
                    helpers: false,
                    polyfill: false,
                    regenerator: true,
                    moduleName: 'babel-runtime'
                }],
                ['babel-plugin-transform-builtin-extend', {
                    globals: ['Error', 'Array']
                }],
                ['transform-class-properties', {spec: true}],
                'add-module-exports',
                ['transform-es2015-modules-umd', {
                    globals: moduleMap,
                    exactGlobals: true
                }]
            ]
        }))
        .pipe(sort())
        .pipe(concat('j2d.min.js'))
        .pipe(uglify())
        .pipe(header(fs.readFileSync('src/header.js', 'utf8')))
        .pipe(source.write('.', {
            mapFile: (mapFilePath) => mapFilePath.replace('.js.map', '.map')
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('babel:build-dev', () => {
    return gulp.src(config.input)
        .pipe(source.init())
        .pipe(babel({
            babelrc: false,
            moduleIds: true,
            presets: [['es2015', {
                modules: false
            }]],
            plugins: [
                ['transform-runtime', {
                    helpers: false,
                    polyfill: false,
                    regenerator: true,
                    moduleName: 'babel-runtime'
                }],
                ['babel-plugin-transform-builtin-extend', {
                    globals: ['Error', 'Array']
                }],
                // 'transform-decorators-legacy',
                // 'transform-decorators',
                ['transform-class-properties', {spec: true}],
                'add-module-exports',
                ['transform-es2015-modules-umd', {
                    globals: moduleMap,
                    exactGlobals: true
                }]
            ]
        }))
        .pipe(sort())
        .pipe(concat('j2d.js'))
        .pipe(source.write('.', {
            mapFile: (mapFilePath) => mapFilePath.replace('.js.map', '.map')
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css-styles', () => {
    return gulp.src(config.cssSources)
        .pipe(csso())
        .pipe(rename((path) => {
            path.extname = ".min.css"
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('images', () => {
    return gulp.src(config.imgSources)
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('example', () => {
    return gulp.src(config.exampleSources)
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
    return gulp.src('dist', {read: false, force: true})
        .pipe(clean());
});

gulp.task('build:dev', ['clean'], () => {
    return gulp.start(['babel:build-dev', 'css-styles', 'images', 'example']);
});

gulp.task('build', ['clean'], () => {
    return gulp.start(['babel:build', 'css-styles', 'images']);
});

gulp.task('default', ['build']);
