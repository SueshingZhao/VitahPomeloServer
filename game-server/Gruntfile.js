'use strict';
module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	global._$jscoverage = {};

	grunt.initConfig({
		jsbeautifier: {
			files: ['./app/**/*.js', './config/**/*.json'],
			options: {
				js: {
					braceStyle: 'collapse',
					breakChainedMethods: false,
					e4x: true,
					evalCode: true,
					indentChar: ' ',
					indentLevel: 0,
					indentSize: 4,
					indentWithTabs: false,
					jslintHappy: true,
					keepArrayIndentation: true,
					keepFunctionIndentation: true,
					maxPreserveNewlines: 2,
					preserveNewlines: true,
					spaceBeforeConditional: true,
					spaceInParen: false,
					unescapeStrings: true,
					wrapLineLength: 0,
					endWithNewline: false
				}
			}
		},
		jshint: {
			files: [
				'./app/**/*.js',
				'./*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		}
	});

	// Register group tasks
	grunt.registerTask('default', ['jsbeautifier', 'jshint']);
};
