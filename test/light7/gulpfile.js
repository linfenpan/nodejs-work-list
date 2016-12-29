'use strict';
const gulp = require('gulp');
const gulpTasks = require('require-dir')('./gulpTasks');

gulp.task('build:light7:js', () => {
  gulpTasks.light7.buildJS();
});
gulp.task('build:light7:css', () => {
  gulpTasks.light7.buildCSS();
});
gulp.task('build:light7', ['build:light7:js', 'build:light7:css'], () => console.log('light7 编译完成'));


// 外部使用的任务:

gulp.task('default', ['build:light7'], () => {
  console.log('所有任务完成');
});
gulp.task('watch', () => {
  console.log('正在监听 light7 变化:');
  gulpTasks.light7.watch();
});
