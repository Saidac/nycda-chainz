const gulp = require('gulp'),
      sass = require('gulp-sass'),
      concat = require('gulp-concat'),
      mocha = require('gulp-mocha');

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
gulp.task('test:unit', () => {
  gulp.src('tests/unit/**/*.js')
    .pipe(mocha());
});

gulp.task('test', ['test:unit'], () => {
  gulp.watch('tests/unit/**/*.js', ['test:unit']);

});
