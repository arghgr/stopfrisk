
module.exports = grunt => {
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      options: {
        sourceMap: false
      },
      dist: {
        files: { 'public/main.css': 'scss/main.scss' }
      }
    },
    browserify: {
      main: {
        src: 'js/app.js',
        dest: 'public/main.js'
      }
    },
    watch: {
      sass: {
        files: 'scss/*.scss',
        tasks: ['sass']
      },
      browserify: {
        files: 'js/*.js',
        tasks: ['browserify']
      },
      livereload: {
        files: ['*.js', '*.html', 'scss/*.scss'],
        livereload: true
      }
    }
  });

  grunt.registerTask('default', ['browserify', 'sass']);
  grunt.registerTask('dev', ['watch']);
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

}
