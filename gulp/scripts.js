/* 
* @Author: roverzon
* @Date:   2015-04-18 15:55:00
* @Last Modified by:   roverzon
* @Last Modified time: 2015-04-18 17:07:22
*/

'use strict';
var gulp = require('gulp')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')
var ngAnnotate = require('gulp-ng-annotate') 

gulp.task('js', function(){
	gulp.src(['ng/module.js','ng/**/*.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('innet.min.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/js'))
})


gulp.task('watch:js',['js'],function(){
	gulp.watch('ng/**/*.js',['js'])
})
