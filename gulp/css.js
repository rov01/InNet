/* 
* @Author: roverzon
* @Date:   2015-04-18 15:54:27
* @Last Modified by:   roverzon
* @Last Modified time: 2015-04-18 17:47:07
*/

'use strict';

var gulp   = require('gulp')
var stylus = require('gulp-stylus')
var minifycss = require('gulp-minify-css')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('css', function(){
	gulp.src('css/**/*.styl')
		.pipe(sourcemaps.init())
		.pipe(stylus())
		.pipe(concat('innet.min.css'))
		.pipe(minifycss())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/css'))

})

gulp.task('watch:css',['css'],function(){
	gulp.watch('css/**/*.styl',['css'])
})