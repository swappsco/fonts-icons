var gulp = require('gulp');
var iconfont   = require('gulp-iconfont');
var rename = require('gulp-rename');
var runTimestamp = Math.round(Date.now()/1000);
var runSequence = require('run-sequence').use(gulp);
var sass = require("gulp-sass");
var template = require('gulp-swig');

var config = {
  className: 'icon',
  comment: 'DO NOT EDIT DIRECTLY! Generated by the `gulp font-icons` task',
  cssDest: './build/css',
  fontsDest: './build/fonts',
  fontPath: '/build/fonts',
  iconSrc: './assets/icons/*.svg',
  name: 'FontIcons',
  sassDest: './assets/sass',
  sassOutputName: 'font_icons.sass',
  sassTemplate: './assets/templates/icon.sass.template',
  options: {
    prependUnicode: true,
    fontName: 'font-icons',
    formats: ['woff', 'woff2', 'ttf'],
    normalize: true,
    timestamp: runTimestamp
  }
};

gulp.task('default', function() {
  runSequence('generate-fonts', 'generate-css')
});

/**
 * Generate 'woff', 'woff2', 'ttf' fonts
 * 
 */
gulp.task('generate-fonts', function(){
  return gulp.src(config.iconSrc)
    .pipe(iconfont(config.options))
    .on('glyphs', function(glyphs, options) {
      generateIconSass(glyphs);
    })
    .pipe(gulp.dest(config.fontsDest));
});

function generateIconSass(glyphs) {
  var iconSass = template({
    data: {
      icons: glyphs.map(icon => {
        var name = icon.name;
        var code = icon.unicode[0].charCodeAt(0).toString(16).toUpperCase();
        return {name: name, code: code};
      }),
      className: config.className,
      comment: config.comment,
      fontName: config.options.fontName,
      fontPath: config.fontPath
    }
  });
  return gulp.src(config.sassTemplate)
    .pipe(iconSass)
    .pipe(rename(config.sassOutputName))
    .pipe(gulp.dest(config.sassDest));
}

/**
 * From Sass generate CSS File.
 */
gulp.task('generate-css', function () {
  return gulp.src(config.sassDest + "/**.sass" )
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(config.cssDest));
});