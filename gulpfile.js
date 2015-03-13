var gulp = require('gulp'),
  autopolyfiller = require('gulp-autopolyfiller'),
  styl = require('gulp-stylus'),
  inline = require('rework-inline'),
  minifyCSS = require('gulp-minify-css'),
  nodemon = require('gulp-nodemon'),
  storyTransmitter = require('./server/lib/storyTransmitter'),
  gutil = require('gulp-util'),
  react = require('gulp-react'),
  uglify = require('gulp-uglify');

gulp.task('default', ['convert:css', 'minify:js', 'polifill:js', 'deamon:transmitter'], function () {
  nodemon({
    script: 'index.js',
    execMap: {"js": "node --harmony"},
    ext: 'html js css jade styl',
    ignore: ['ignored.js'],
  })
    .on('restart', function() {
      console.log('nodemon restarted!');
    });
});

gulp.task('convert:css', function(cb) {
  gulp.src(['./compile/css/*.styl'])
      .pipe(styl( inline() ))
      .pipe(minifyCSS())
      .pipe(gulp.dest('./client/css'));

  console.log('converting processing!');

  cb();
});

gulp.task('minify:js', function(cb) {

  gulp.src(['./compile/js/*.jsx'])
    .pipe(react({harmony: true}))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('./client/js'));

  cb();
});

gulp.task('polifill:js', function(cb) {
  gulp.src(['./client/js/*.js'])
    .pipe(autopolyfiller('polifil.js'))
    .pipe(gulp.dest('./client/js'));

  cb();
});

gulp.task('deamon:transmitter', function(cb) {

  console.log('deamon:transmitter started!');
  setInterval(storyTransmitter, 10800000);

  cb();
});
