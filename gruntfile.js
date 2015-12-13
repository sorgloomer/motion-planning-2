module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: {
            temp: ['.tmp', 'dist']
        },
        babel: {
            modules: {
                files: [{
                    dest: '.tmp/babel/modules/',
                    cwd: 'app/modules',
                    src: ['**/*'],
                    filter: 'isFile',
                    expand: true
                }],
                options: {
                    plugins: [ require('babel-plugin-transform-es2015-modules-amd') ]
                        .concat(require('babel-preset-es2015').plugins)
                        .concat(require('babel-preset-stage-3').plugins),
                    moduleRoot: '',
                    sourceRoot: 'app/modules/',
                    moduleIds: true
                }
            }
        },
        concat: {
            modules: {
                src: [
                    'app/lib/require.js',
                    '.tmp/babel/modules/**/*'
                ],
                dest: '.tmp/concat/modules/modules.js',
                separator: ';\n\n\n'
            }
        },
        copy: {
            devel: {
                files: [
                    { dest: '.tmp/dist/modules.js', src: '.tmp/concat/modules/modules.js' }
                ]
            },
            dist: {
                files: [
                    { dest: 'dist/modules.js', src: '.tmp/concat/modules/modules.js' },
                    { expand: true, dest: 'dist/', cwd: 'app/', src: '*', filter: 'isFile' },
                    { expand: true, dest: 'dist/', cwd: 'app/', src: 'tex/**/*', filter: 'isFile' },
                    { expand: true, dest: 'dist/', cwd: 'app/', src: 'lib/**/*', filter: 'isFile' },
                    { expand: true, dest: 'dist/', cwd: 'app/', src: 'js/**/*', filter: 'isFile' },
                    { expand: true, dest: 'dist/', cwd: 'app/', src: 'bootstrap/**/*', filter: 'isFile' }
                ]
            }
        },
        express: {
            devel: {
                options: {
                    port: 8000,
                    bases: ['.tmp/dist/', 'app/']
                }
            },
            dist: {
                options: {
                    port: 8000,
                    bases: ['dist/']
                }
            }
        },
        watch: {
            scripts_devel: {
                options: {
                    spawn: false
                },
                files: ['app/**/*.js'],
                tasks: ['build:devel']
            },
            scripts_dist: {
                options: {
                    spawn: false
                },
                files: ['app/**/*.js'],
                tasks: ['build:dist']
            }
        }
    });


    grunt.registerTask('dist', ['clean:temp', 'babel:modules', 'concat:modules', 'copy:dist']);
    grunt.registerTask('build:common', ['clean:temp', 'babel:modules', 'concat:modules']);
    grunt.registerTask('build:dist', ['build:common', 'copy:dist']);
    grunt.registerTask('build:devel', ['build:common', 'copy:devel']);
    grunt.registerTask('serve:dist', ['express:dist', 'watch:scripts_dist']);
    grunt.registerTask('serve:devel', ['express:devel', 'watch:scripts_devel']);
    grunt.registerTask('serve', ['serve:dist']);

    grunt.registerTask('default', ['build:dist', 'serve:dist']);
};