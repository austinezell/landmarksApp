var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var babel = require('gulp-babel');


var dirs = {
  src: {
    js: "src/js/**/*.js",
    scss: "src/scss/**/*.scss",
    html: "src/templates/**/*.html"
  },
  out: {
    html: 'public/html',
    css: 'public/css',
    js: 'public/js'
  }
}
gulp.task('default', ['sass', 'scripts', 'templates']);

gulp.task('sass', function(done) {
  gulp.src('src/scss/style.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(concat('style.css'))
    .pipe(gulp.dest(dirs.out.css))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(dirs.out.css))
    .on('end', done);
});

gulp.task('scripts', function(){
  return gulp.src(dirs.src.js)
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(gulp.dest(dirs.out.js))
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest(dirs.out.js));
})

gulp.task('templates', function(){
  return gulp.src(dirs.src.html)
    .pipe(gulp.dest(dirs.out.html))
})

gulp.task('watch', function() {
  gulp.watch(dirs.src.html, ['templates']);
  gulp.watch(dirs.src.scss, ['sass']);
  gulp.watch(dirs.src.js, ['scripts']);
});
