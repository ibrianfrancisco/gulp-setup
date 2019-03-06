const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const sourcemaps = require('gulp-sourcemaps');

// Spin up a local dev server on localhost:3000
function serve() {
  return browserSync.init({
    server: 'build',
    open: false,
    port: 3000
  });
}

// Watch for changes in app directory. Hot reloading only for html
function watch() {
  gulp.watch('app/scripts/*.js', processJs);
  gulp.watch([
    'app/styles/*.scss',
    'app/styles/**/*.scss'
  ], processCss);
  gulp.watch('app/index.html', processHtml).on('change', browserSync.reload);
}
gulp.task('watch', watch);
gulp.task('start', gulp.series(processImgs, processHtml, processCss, processJs, gulp.parallel(serve, watch)));


function processImgs() {
  return gulp.src('app/**/*.jpg')
    .pipe(gulp.dest('build'));
}
gulp.task('processImgs', processImgs);


function processHtml() {
  return gulp.src('app/index.html')
    .pipe(gulp.dest('build'));
}
gulp.task('processHtml', processHtml);

// maps scss file, compiles and minifies
function processCss() {
  return gulp.src('app/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      errorLogToConsole: true,
      outputStyle: 'compressed'
    }))
    .on('error', console.error.bind(console))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/styles'))
    .pipe(browserSync.stream());
}
gulp.task('processCss', processCss);

// maps js file, compiles and minifies
function processJs() {
  return gulp.src('app/scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/scripts'))

    .pipe(browserSync.stream());
}
gulp.task('processJs', processJs);
