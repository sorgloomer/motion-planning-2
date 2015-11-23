module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: {
            temp: ['.tmp']
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
            dist: {
                files: [
                    { dest: '.tmp/dist/modules.js', src: '.tmp/concat/modules/modules.js' }
                ]
            }
        },
        express: {
            dist: {
                options: {
                    port: 8000,
                    bases: ['.tmp/dist/', 'app/']
                }
            }
        },
        watch: {
            scripts: {
                options: {
                    spawn: false
                },
                files: ['app/**/*.js'],
                tasks: ['build']
            }
        }
    });


    grunt.registerTask('build', ['clean:temp', 'babel:modules', 'concat:modules', 'copy:dist']);
    grunt.registerTask('serve:dist', ['express:dist', 'watch']);
    grunt.registerTask('serve', ['serve:dist']);

    grunt.registerTask('default', ['build', 'serve']);
};