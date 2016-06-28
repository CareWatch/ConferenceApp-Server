module.exports = function(grunt){
    'use strict';
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            main: {
                src: [
                    'libs/*.js'
                ],
                dest: 'build/scripts.js'
            }
        },
        uglify: {
            main: {
                files: {
                    'build/scripts.min.js': '<%= concat.main.dest %>'
                }
            }
        },
        watch: {
            concat: {
                files: '<%= concat.main.src %>',
                tasks: 'concat'
            }
        }
    });

    grunt.registerTask('default', ['concat', 'uglify']);
};