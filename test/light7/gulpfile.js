'use strict';
const gulp = require('gulp');
const gulpTasks = require('require-dir')('./gulpTasks');
const path = require('path');
//
// gulp.task('build:light7:js', () => {
//   gulpTasks.light7.buildJS();
// });
// gulp.task('build:light7:css', () => {
//   gulpTasks.light7.buildCSS();
// });
// gulp.task('build:light7', ['build:light7:js', 'build:light7:css'], () => console.log('light7 编译完成'));
//
//
// // 外部使用的任务:
//
// gulp.task('default', ['build:light7'], () => {
//   console.log('所有任务完成');
// });
// gulp.task('watch', () => {
//   console.log('正在监听 light7 变化:');
//   gulpTasks.light7.watch();
// });

const babel = require('gulp-babel');
const concat = require("gulp-concat");
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('default', () => {
  const scripts = [
    'src/util.js', 'src/base.js', 'src/animate-mobile/animate.js', 'src/modal.js', 'src/popup.js', 'src/output.js',
    // 下面这堆，都是 picker.js 依赖的
    'src/mobile/util.js', 'src/mobile/device.js', 'src/mobile/zepto-adapter.js', 'src/mobile/picker-modal.js', 'src/mobile/picker.js'
  ];
  gulp.watch(scripts, () => {
    console.log('编译　脚本');
    gulp.src(scripts)
      .pipe(concat('jquery-modal2.js'))
      .pipe(babel({
          presets: ['es2015']
      }))
      .pipe(gulp.dest('dest'));
  });

  const styles = [
    'src/style.less',
    // 下面这堆，都是 picker.js 依赖的
    'src/mobile/picker.less'
  ];
  gulp.watch(styles, () => {
    console.log('编译　less');
    gulp.src(styles)
      .pipe(concat('jquery-modal.css'))
      .pipe(less({
        // @see http://www.lesscss.net/
        paths: [path.join(__dirname, './src'), path.join(__dirname, 'src/mobile')],
        globalVars: {
          scale: '1rem',
          modalWidth: '13.5rem',
          modalColor: '#8a4f32'
        }
      }))
      .pipe(autoprefixer({
        browsers: [ 'Android >= 2', 'Chrome >= 20', 'Firefox >= 24', 'Explorer >= 9', 'iOS >= 6', 'Opera >= 12', 'Safari >= 6' ]
      }))
      .pipe(gulp.dest('dest'));
  });
});
