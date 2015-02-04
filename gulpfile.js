var gulp = require('gulp'),
  styl = require('gulp-stylus'),
  inline = require('rework-inline'),
  nodemon = require('gulp-nodemon');

gulp.task('default', ['convert:css'], function () {
  nodemon({
    script: 'index.js',
    execMap: {"js": "node --harmony"},
    ext: 'html js',
    ignore: ['ignored.js'],
  })
    .on('change', ['convert:css'])
    .on('restart', function() {
      console.log('nodemon restarted!');
    });
});

gulp.task('convert:css', function(cb) {
  gulp.src(['./complie/css/*.styl'])
      .pipe(styl( inline() )
      .pipe(gulp.dest('./client/css'));

  console.log('converting processing!');

  cb();
});
