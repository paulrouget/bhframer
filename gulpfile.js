'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var watchify = require('watchify');
var http = require('http');
var ecstatic = require('ecstatic');
var path = require('path');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');


var settings = {
  cache: {},
  packageCache: {},
};

gulp.task('script', function() {

  var bundle = browserify({
    entries: ['app.js'],
    debug: true,
    cache: settings.cache,
    packageCache: settings.packageCache
  }).bundle()
    .on('error', gutil.log)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload({reloadPage: 'index.html'}))
    .on('error', gutil.log);
});

gulp.task('copy', function() {
  gulp.src('./index.html').pipe(gulp.dest('./dist/'));
  gulp.src('./images/*').pipe(gulp.dest('./dist/images/'));
  gulp.src('./pages/*').pipe(gulp.dest('./dist/pages/'));
  gulp.src('./framer/*').pipe(gulp.dest('./dist/framer/'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('index.html', ['build']);
  gulp.watch('modules/**', ['build']);
  gulp.watch('app.js', ['build']);
});

gulp.task('server', function() {
  var server = http.createServer(ecstatic({
    root: path.join(module.filename, '../dist'),
    cache: 0
  }));
  server.listen(6060);
});

gulp.task('default',      ['build']);
gulp.task('build',        ['script', 'copy']);
gulp.task('build-server', ['watch', 'build', 'server'])
