/* 
* @Author: roverzon
* @Date:   2015-04-18 15:58:19
* @Last Modified by:   roverzon
* @Last Modified time: 2015-04-18 15:58:22
*/

'use strict';
var gulp = require('gulp')
var nodemon = require('gulp-nodemon')

gulp.task('dev:server',function(){
	nodemon({
		script: 'server.js',
		ext: 'js',
		ignore: ['ng*','gulp*','assets*']
	})
})