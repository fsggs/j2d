module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['requirejs', 'qunit'],
        files: [
            {pattern: 'dist/vendor/*.js', included: false},
            {pattern: 'src/js/**/*.js', included: false},
            {pattern: 'tests/js/**/*.test.js', included: false},

            'tests/main-test.js'
        ],
        plugins:[
            'karma-qunit',
            'karma-requirejs',
            'karma-coverage',
            'karma-phantomjs-launcher'
        ],
        exclude: [],
        preprocessors: {
            'src/js/**/*.js': ['coverage']
        },
        reporters: ['progress', 'coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: true,

        coverageReporter: {
            reporters: [
                {
                    type: 'text-summary'
                }
            ]
        }
    });
};
