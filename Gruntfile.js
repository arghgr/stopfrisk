
module.exports = grunt => {
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      options: {
        sourceMap: false
      },
      dist: {
        files: {
          'public/main.css': 'scss/main.scss'
        }
      }
    },
    watch: {
      sass: {
        files: 'scss/*.scss',
        tasks: ['sass']
      },
      livereload: {
        files: ['*.js', '*.html', 'scss/*.scss'],
        livereload: true
      }
    }
  });

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('dev', ['sass']);
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

}
