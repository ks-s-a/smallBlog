var gulp = require('gulp'),
  styl = require('gulp-stylus'),
  inline = require('rework-inline'),
  nodemon = require('gulp-nodemon'),
  db = require('./server/db'),
  storyTransmitter = require('./server/lib/storyTransmitter');

gulp.task('default', ['convert:css', 'deamon:transmitter'], function () {
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
      .pipe(gulp.dest('./client/css'));

  console.log('converting processing!');

  cb();
});

gulp.task('deamon:transmitter', function(cb) {

  console.log('deamon:transmitter started!');
  setInterval(storyTransmitter.bind(this, db), 30000);

  cb();
});
