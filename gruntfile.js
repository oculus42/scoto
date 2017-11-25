const conf_mochaIstanbul = {
    coverage: {
        src: 'test', // a folder works nicely
        options: {
            mask: '*.js'
        }
    }
};

const conf_simpleMocha = {
    options: {
        globals: ['expect'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'tap'
    },
    all: { src: ['test/*.js'] }
};

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mocha_istanbul: conf_mochaIstanbul,
        simplemocha: conf_simpleMocha
    });

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    grunt.registerTask('default', ['mocha_istanbul']);
    grunt.registerTask('test', ['simplemocha']);
    grunt.registerTask('cover', ['mocha_istanbul']);
};