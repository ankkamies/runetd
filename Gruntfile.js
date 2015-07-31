module.exports = function(grunt) {
  grunt.initConfig({

    clean: {
      bundle: ['bundle.js'],
      all: ['dist', 'bundle.js']
    },

    jshint: {
      options: {
        node: true,
        globals: {
          require: true
        },
      },
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },

    jade: {
      compile: {
        options: {
          client: false,
          pretty: true
        },
        files: [ {
          cwd: "src/jade",
          src: "**/*.jade",
          dest: "dist/",
          expand: true,
          ext: ".html"
        } ]
      }
    },

    less: {
      dev: {
        options: {
          compress: false
        },
        files: {
          "dist/css/style.css": "src/less/style.less"
       }
     },
     release: {
        options: {
          compress: true
        },
        files: {
          "dist/css/style.css": "src/less/style.less"
        }
      }
    },

    copy: {
      all: {
        expand: true,
        cwd: 'src/assets',
        src: ['**/*', '!Gruntfile.js'],
        dest: 'dist/assets/',
      },
    },

    browserify: {
      dev: {
        src: 'src/js/app.js',
        dest: 'dist/js/bundle.js'
      },
      release: {
        src: 'src/js/app.js',
        dest: 'bundle.js'
      }
    },

    connect: {
      options: {
        port: process.env.PORT || 3131,
        base: 'dist/',
      },

      all: {},
    },

    uglify: {
      release: {
        files: {
          'dist/js/bundle.js': ['bundle.js']
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },

      jade: {
        files: ['src/jade/**/*.jade'],
        tasks: ['jade'],
      },

      js: {
        files: ['src/js/**/*.js'],
        tasks: ['jshint', 'browserify'],
      },

      less: {
        files: ['src/less/**/*.less'],
        tasks: ['less:dev'],
      },

      assets: {
        files: ['src/assets/**/*', '!Gruntfile.js'],
        tasks: ['copy'],
      }
    }

  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['jshint', 'clean:all', 'jade', 'copy']);

  grunt.registerTask('dev', ['default', 'browserify:dev', 'less:dev', 'connect', 'watch']);

  grunt.registerTask('build', ['default', 'browserify:release', 'uglify:release', 'clean:bundle']);

};