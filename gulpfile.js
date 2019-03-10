const gulp = require('gulp');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');

// Spin up a local dev server on localhost:3000
function serve() {
  return browserSync.init({
    server: 'build',
    open: true,
    port: 8000
  });
}

// Watch for changes in app directory. Hot reloading only for html
function watch() {
  gulp.watch('app/scripts/*.js', processJs);
  gulp.watch([
    'app/styles/*.scss'
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
function processCss(done) {
  const sass = require('gulp-sass');
  const postcss = require('gulp-postcss');
  const tailwindcss = require('tailwindcss');
  const purgecss = require('gulp-purgecss')
  const cleanCss = require('gulp-clean-css');
  const concat = require('gulp-concat');

  return gulp.src('app/styles/main.scss')
    .pipe(sass())
    .pipe(postcss([
      tailwindcss('./tailwind.js'),
      require('autoprefixer'),
    ]))
    // uncomment when build is ready for production
    // .pipe(
    //   purgecss({
    //     content: ['app/*.html']
    //   }))
    .pipe(cleanCss({compatibility: 'ie8'}))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('build/styles'))
    .pipe(browserSync.stream());
    done();
}
gulp.task('processCss', processCss);

// maps js files, compiles and minifies
function processJs(done) {
  const jsSRC = 'main.js';
  const jsFolder = 'app/scripts/';
  const jsFILES = [jsSRC];

  const babelify = require('babelify')
  const browserify = require('browserify');
  const uglify = require('gulp-uglify');
  const source = require('vinyl-source-stream');
  const buffer = require('vinyl-buffer');

  jsFILES.map(function(entry) {
    return browserify({
      entries: [jsFolder + entry]
    })
    .transform(babelify, {
      presets: ['env']
    })
    .bundle()
    .pipe(source(entry))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/scripts'))
    .pipe(browserSync.stream());
  })
  done();
}
gulp.task('processJs', processJs);
