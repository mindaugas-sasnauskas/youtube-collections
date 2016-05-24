module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),
    watch: {
      scripts: {
        files: ['**/*.js'],
        output: {
          options: {
            event: 'all',
            livereload: true
          },
          files: ['<%= distdir %>/**/*']
        }
      },
    },
    connect: {
      options: {
        hostname: 'localhost',
        port: 3000,
        base: '/'
      },
      devserver: {
        options: {
          // Or use browser livereload plugin. See:
          // http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-
          livereload: true
        }
      },
      open: {
        browser: {
          path: 'http://localhost:3000',
        }
      },
    }
  })
grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('run', [ 'watch','connect:devserver']);
}
