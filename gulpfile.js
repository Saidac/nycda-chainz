const gulp = require('gulp'),
      sass = require('gulp-sass'),
      concat = require('gulp-concat');

gulp.task('default', () => {
  console.log('default task runs');
});

gulp.task('scss', () => {
  gulp.src('assets/scss/application.scss')
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(concat('application.css'))
      .pipe(gulp.dest('public/css'));
});

gulp.task('js', () => {
  gulp.src('assets/js/application.js')
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(concat('application.js'))
      .pipe(gulp.dest('public/js'));
});

gulp.task('watch', ['scss'], () => {
  gulp.watch('assets/scss/**/*.scss', ['scss']);
});
