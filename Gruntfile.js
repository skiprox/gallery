/*global module:false*/
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    browserify: {
      examples: {
        options: {
          debug: true
        },
        files:[{
          src: ['examples/main.js'],
          dest: 'examples/js/main.js'
        }]
      }
    },
    watch: {
      scripts: {
        files: ['gallery.js', 'examples/main.js'],
        tasks: ['browserify']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['browserify:examples']);
  grunt.registerTask('debug', ['watch'])

};
