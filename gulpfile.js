/* 
* @Author: roverzon
* @Date:   2015-04-18 16:05:24
* @Last Modified by:   roverzon
* @Last Modified time: 2015-04-18 16:05:41
*/

'use strict';

var gulp = require('gulp')
var fs = require('fs')

fs.readdirSync(__dirname + '/gulp').forEach(function(task){
	require('./gulp/' + task)
})

gulp.task('build',['js','css'])
gulp.task('watch',['watch:js','watch:css'])
gulp.task('dev',['watch','dev:server'])
