module.exports = function(grunt) {
   "use strict";

   var DEBUG = grunt.option('debug');

   grunt.option('dist', grunt.option('dist') || 'dist');

   /**
    * Grunt Project Configuration
    */
   grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),
      dist: grunt.option('dist'),

      copy: {
         markup: {
            files: [
               { expand: true, cwd: 'src/html', src: '**/*', dest: '<%= dist %>/' }
            ]
         },

         css: {
            files: [
               { expand: true, cwd: 'src/css', src: 'main.css', dest: '<%= dist %>/css/' }
            ]
         },

         glyphicons: {
            files: [
               { expand: true, cwd: 'node_modules/bootstrap/dist/fonts', src: '*', dest: '<%= dist %>/fonts/' }
            ]
         },

         fontawesome: {
            files: [
               { expand: true, cwd: 'node_modules/font-awesome/fonts', src: '*', dest: '<%= dist %>/fonts/' }
            ]
         },

         modernizr: {
            files: [
               { expand: true, cwd: 'thirdparty/js', src: 'modernizr-3.2.0.min.js', dest: '<%= dist %>/js/' }
            ]
         },
      },

      cssmin: {
         thirdparty: {
            src: [
               'node_modules/bootstrap/dist/css/bootstrap.css',
               'node_modules/highlight.js/styles/tomorrow.css',
               'node_modules/font-awesome/css/font-awesome.css',
               'node_modules/bootstrap-social/bootstrap-social.css',
            ],
            dest: '<%= dist %>/css/thirdparty.css',
         }
      },

      browserify: {
         'js-thirdparty': {
            files: {
               '<%= dist %>/js/thirdparty.js': [
                  'src/js/thirdparty.js',
               ]
            },
            options: {
               require: [
                  'class.extend',
                  'jquery',
                  'underscore',
                  'q',
                  'bootstrap',
               ]
            }
         },

         'js-ours': {
            files: {
               '<%= dist %>/js/main.js': [
                  'src/js/auth/google.js',
                  'src/js/auth/github.js',
               ],
            },
            options: {
               external: [
                  'class.extend',
                  'jquery',
                  'underscore',
                  'q'
               ]
            }
         },

      },

      uglify: {
         options: {
            banner: '/*! <%= grunt.template.today("dd-mm-yyyy") %> */\n',
            sourceMap: true,
            sourceMapIncludeSources: true,
            mangle: !DEBUG,
            compress: !DEBUG,
            beautify: DEBUG

         },

         'js-thirdparty': {
            files: {
               '<%= dist %>/js/thirdparty.js': [
                  '<%= dist %>/js/thirdparty.js',
               ]
            }
         },

         'js-ours': {
            files: { '<%= dist %>/js/main.js': '<%= dist %>/js/main.js' }
         },
      },

      watch: {
         options: {
            // Setup to use the livereload browser extension
            livereload: true,
            port: 9000
         },
         'markup': {
            files: 'src/html/**/*',
            tasks: [ 'copy:markup' ]
         },
         'css': {
            files: 'src/css/**/*',
            tasks: [ 'copy:css' ]
         },
         'js-thirdparty': {
            files: [ 'src/js/thirdparty.js' ],
            tasks: [ 'browserify:js-thirdparty', 'uglify:js-thirdparty' ]
         },
         'js-ours': {
            files: [ 'src/js/**/*.js', '!src/js/thirdparty.js' ],
            tasks: [ 'browserify:js-ours', 'uglify:js-ours' ]
         },
         'grunt': {
            files: [ 'Gruntfile.js' ],
            tasks: [ 'build' ]
         }
      },

      clean: {
         dist: '<%= dist %>/**/*'
      }

   });

   // Load tasks
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-browserify');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-cssmin');
   grunt.loadNpmTasks('grunt-contrib-watch');

   grunt.registerTask('build', [
      'copy',
      'cssmin',
      'browserify:js-ours',
      'uglify:js-ours',
      'browserify:js-thirdparty',
      'uglify:js-thirdparty'
   ]);

   grunt.registerTask('default', [ 'build' ]);
};
