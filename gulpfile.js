// set environment directly
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'development';
}

const autopolyfiller = require('gulp-autopolyfiller'),
  del = require('del'),
  gulp = require('gulp'),
  gulpWebpack = require('gulp-webpack'),
  gutil = require('gulp-util'),
  inline = require('rework-inline'),
  minifyCSS = require('gulp-minify-css'),
  nodemon = require('gulp-nodemon'),
  storyTransmitter = require('./server/lib/storyTransmitter'),
  styl = require('gulp-stylus'),
  react = require('gulp-react'),
  runSequence = require('run-sequence'),
  webpack = require('webpack'),
  vinylPaths = require('vinyl-paths'),
  uglify = require('gulp-uglify');

// Initial task to both: production and development
gulp.task('default', function(cb) {
  runSequence(
    'clean',

    ['convert:jsx', 'convert:css'],
    'webpack',
    'polifill:js',
    
    'start',
    'deamon:transmitter',
    cb
  );
});

gulp.task('start', function() {
  return process.env.NODE_ENV === 'production' ?  
    
    // production mode
    nodemon({
      script: 'index.js',
      execMap: {"js": "node --harmony"},
    }) : 

    // development mode
    nodemon({
      execMap: {"js": "NODE_ENV=\"development\" node --harmony"},
      ext: 'html js css jade styl jsx',
      ignore: ['server/reactComponents', 'client/js', 'client/css'],
      script: 'index.js',
    })
      .on('restart', ['convert:jsx', 'convert:css', 'webpack'], function() {
        console.log('nodemon restarted!');
      });
});

gulp.task('clean', function() {
  return gulp.src('./client/{js,css}/*')
    .pipe( vinylPaths(del) );
});

gulp.task('convert:jsx', function() {
  return gulp.src('./compile/js/*.jsx')
    .pipe(react({harmony: true}))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('./server/reactComponents'))
    .pipe(gulp.dest('./client/js'));
});

gulp.task('webpack', function() {
  return gulp.src('webpack-init.js')
    .pipe(gulpWebpack({
      output: {
        filename: 'bundle.js',
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin()
      ],
    }, webpack))
    .pipe(gulp.dest('./client/js'));
});

gulp.task('convert:css', function() {
  return gulp.src(['./compile/css/*.styl'])
      .pipe(styl( inline() ))
      .pipe(minifyCSS())
      .pipe(gulp.dest('./client/css'));
});

/*gulp.task('uglify:js', function(cb) {

  gulp.src(['./client/js/*.js'])
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('./client/js'));

  cb();
});*/

gulp.task('polifill:js', function() {
  return gulp.src('./client/js/*.js')
    .pipe(autopolyfiller('polifil.js'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('./client/js'));
});

gulp.task('deamon:transmitter', function() {
  return setInterval(storyTransmitter, 22 * 30 * 60 * 1000); // 22.5 hours
});
