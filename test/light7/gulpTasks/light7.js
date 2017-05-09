'use strict';
const gulp = require('gulp');
const config = require('./config');
const lazypipe = require('lazypipe');
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const header = require("gulp-header");
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const csscomb = require('gulp-csscomb');
const autoprefixer = require('gulp-autoprefixer');

const bannerLight7 = [
  '/*!',
  ' * =====================================================',
  ' * light7.modals - http://light7.org/',
  ' *',
  ' * =====================================================',
  ' */'
].join('\n') + '\n';
const packnameLight7 = 'jquery.modals';
const dist = config.dist, jsPath = `${config.jsSourcePath}/light7`, lessPath = `${config.lessSourcePath}/light7`;

// 脚本添加 header
const jsTransformLight7 = lazypipe()
  .pipe(header, bannerLight7)
  .pipe(gulp.dest, `${config.jsPath}`);

// 脚本压缩重命名
const jsMinLight7 = lazypipe()
  .pipe(uglify, {
      compress: {
          warnings: false
      },
      mangle: true,
      preserveComments: false
  })
  .pipe(rename, { suffix: '.min' })
  .pipe(gulp.dest, `${config.jsPath}`);

function compressLight7() {
  // light7.js
  gulp.src([
    `${jsPath}/util.js`,
    `${jsPath}/device.js`,
    `${jsPath}/zepto-adapter.js`,
    `${jsPath}/modal.js`,
    `${jsPath}/picker.js`
  ])
  .pipe(concat(`${packnameLight7}.js`))
  .pipe(jsTransformLight7())
  .pipe(jsMinLight7());

  console.log('light7 压缩完毕');
}

// 编译 less 文件
const lessCompile = lazypipe()
  .pipe(less, {
    // @see http://www.lesscss.net/
    globalVars: {
      scale: '1rem'
    }
  })
  .pipe(autoprefixer, {
    browsers: config.autoprefixerBrowsers
  })
  .pipe(header, bannerLight7)
  .pipe(rename, { basename: packnameLight7 })
  .pipe(gulp.dest, `${config.cssPath}`);

// css 压缩
const lessMinify = lazypipe()
  .pipe(csscomb)
  .pipe(cssmin)
  .pipe(rename, { basename: packnameLight7, suffix: '.min' })
  .pipe(gulp.dest, `${config.cssPath}`);

function buildLess() {
  gulp.src(`${lessPath}/modal.less`)
    .pipe(lessCompile())
    .pipe(lessMinify());

  console.log('light7 less文件编译完成');
}

module.exports = {
  buildJS() {
    compressLight7();
  },
  buildCSS() {
    buildLess();
  },
  run() {
    this.buildJS();
    this.buildCSS();
  },
  watch() {
    gulp.watch([`${jsPath}/*.js`, `${jsPath}/i18n/*.js`], () => {
      this.buildJS();
    });
    gulp.watch([`${lessPath}/*.less`], () => {
      this.buildCSS();
    });
  },
}
