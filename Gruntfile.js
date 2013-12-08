module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');

    // Project configuration.
    grunt.initConfig({
		qunit: {
			files: ['Tests/Unit/QUnit/index.html']
		},
		jshint: {
			all: ['Javascript/megapony.js']
		}
    });

    // Task to run tests
    grunt.registerTask('test', ['jshint', 'qunit']);
};