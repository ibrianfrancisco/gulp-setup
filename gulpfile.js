const gulp = require('gulp');
const browserSync = require('browser-sync');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');

function serve() {
  return browserSync.init({
    server: 'build',
    open: false,
    port: 3000
  });
}
function watch() {
  gulp.watch('app/scripts/*.js', processJs);
  gulp.watch('app/styles/*.css', processCss);
}
gulp.task('watch', watch);
gulp.task('start', gulp.series(copy, processJs, processCss, gulp.parallel(serve, watch)));


function copy() {
  return gulp.src([
    'app/*.html',
    'app/**/*.jpg',
    // 'app/**/*.css',
    // 'app/**/*.js'
  ])
  .pipe(gulp.dest('build'));
}
gulp.task('copy', copy);


function processCss() {
  return gulp.src('app/styles/*.css')
  .pipe(cleanCss())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('build/styles'));
}
gulp.task('processCss', processCss);


function processJs() {
  return gulp.src('app/scripts/*.js')
  .pipe(babel({
      presets: ['env']
  }))
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('build/scripts'));
}
gulp.task('processJs', processJs);



