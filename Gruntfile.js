module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	//Project configuration.
	grunt.initConfig({
		browserify: {
      dev: {
        options: {
          debug: true
        },
        files:{
          'app.built.js' : 'app.js'
        }
      }
    },
		watch: {
      js: {
        files: ['app.js'],
        tasks: ['browserify:dev']
      }
    }
	});

	//Task(s).
	grunt.registerTask('default', ['browserify']);
  grunt.registerTask('debug', ['watch'])

}