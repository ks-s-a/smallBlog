var autopolyfiller = require('gulp-autopolyfiller'),
  gulp = require('gulp'),
  webpack = require('gulp-webpack'),
  gutil = require('gulp-util'),
  inline = require('rework-inline'),
  minifyCSS = require('gulp-minify-css'),
  nodemon = require('gulp-nodemon'),
  storyTransmitter = require('./server/lib/storyTransmitter'),
  styl = require('gulp-stylus'),
  react = require('gulp-react'),
  uglify = require('gulp-uglify');

gulp.task('development', ['convert:jsx', 'convert:css', 'webpack', 'minify:js', 'deamon:transmitter'], function () {
  nodemon({
    execMap: {"js": "node --harmony"},
    ext: 'html js css jade styl jsx',
    ignore: ['server/reactComponents', 'client/js', 'client/css'],
    script: 'index.js',
  })
    .on('restart', ['convert:jsx', 'convert:css', 'webpack', 'minify:js'], function() {
      console.log('nodemon restarted!');
    });
});

gulp.task('production', ['convert:jsx', 'convert:css', 'webpack', 'minify:js', 'deamon:transmitter'], function () {
  nodemon({
    script: 'index.js',
    execMap: {"js": "node --harmony"},
  });
});

gulp.task('convert:jsx', function(cb) {
  gulp.src(['./compile/prerender/*.jsx'])
    .pipe(react({harmony: true}))
    .pipe(gulp.dest('./server/reactComponents'))
    .pipe(gulp.dest('./client/js'));

  cb();
});

gulp.task('webpack', function(cb) {
  gulp.src('webpack-init.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js',
      }
    }))
    .pipe(gulp.dest('./client/js'));

  cb();
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
  setInterval(storyTransmitter, 22 * 30 * 60 * 1000); // 22.5 hours

  cb();
});
