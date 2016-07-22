var allTestFiles = [];
var TEST_REGEXP = /\.(spec|test)\.js$/i;

var pathToModule = function (path) {
    return path.replace(/^\/base\//, '../../').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(pathToModule(file));
    }
});

console.log(allTestFiles);

if (global === undefined) {
    var global = window || this
}
if (typeof define !== 'function' || !define.amd) {
    global.j2d = {
        core: {},
        exceptions: {},
        io: {},
        loaders: {},
        media: {},
        nodes: {},
        states: {},
        transitions: {utils: {}},
        utils: {}
    };
}
global.exports = {};

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/src/js',

    paths: {
        'jquery': '../../dist/vendor/jquery.min'
    },

    // ask Require.js to load these files (all our tests)
    deps: allTestFiles,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
