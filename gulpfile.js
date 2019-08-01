"use strict";

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const sass = require('gulp-sass');
const cp = require("child_process");
const del = require("del");
const uncss = require('gulp-uncss');
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const prefix = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

var config = {
   assetsDir: './assets'
};
var app = {};

app.addStyle = function(paths, outputFilename) {
   gulp.src(paths)
        .pipe(plugins.plumber())
        .pipe(plugins.sass({ outputStyle: 'compressed' }, { errLogToConsole: true }))
        .pipe(plugins.concat(outputFilename))
        .pipe(prefix("last 2 versions", "> 1%", "ie 8", "Android 2", "Firefox ESR"))
        .pipe(gulp.dest('./_site/assets/css'))
        .pipe(browserSync.stream());
};

function newSassTask (done) {
   app.addStyle(['./_sass/**/*.scss'], 'main.css');
   app.addStyle(['./css/contact.css'], 'contact.css');
   done();
}

function sassTask() {
   return gulp
      .src('_sass/**/*.scss')
      .pipe(sass({ outputStyle: 'compressed' }, { errLogToConsole: true }))
      .pipe(prefix("last 2 versions", "> 1%", "ie 8", "Android 2", "Firefox ESR"))
      .pipe(gulp.dest("./_site/assets/css/"))
      .pipe(browserSync.stream());
}

// BrowserSync
function browserSyncTask(done) {
   browserSync.init({
      server: {
         baseDir: "./_site"
      },
      port: 4000
   });
   done();
}

// BrowserSync Reload
function browserSyncReloadTask(done) {
   browserSync.reload();
   done();
}

// Clean assets
function cleanTask() {
   return del(["./_site/assets/"]);
}

// Optimize Images
function images() {
   return gulp
      .src("./assets/images/**/*")
      .pipe(newer("./_site/assets/images"))
      .pipe(
         imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
               plugins: [
                  {
                     removeViewBox: false,
                     collapseGroups: true
                  }
               ]
            })
         ])
      )
      .pipe(gulp.dest("./_site/assets/images"));
}

function jekyllBuildTask() {
   return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: 'inherit' });
}

// Watch files
function watchTask() {
   gulp.watch(
      [
         "./index.md",
         "./_includes/**/*",
         "./_layouts/**/*",
         "./_pages/**/*",
         "./_posts/**/*",
         "./_sass/**/*"
      ],
      gulp.series(jekyllBuildTask, browserSyncReloadTask)
   );
   gulp.watch("./assets/images/**/*", images);
}

// define complex tasks
// const js = gulp.series(scriptsLint, scripts);
const build = gulp.series(cleanTask, gulp.parallel(sassTask, jekyllBuildTask));
// const watch = gulp.parallel(watchFiles, browserSync);
// const bsBuild = gulp.parallel(build);
const serve = gulp.series(browserSyncTask, watchTask);
const defaultTask = gulp.series(build, serve);

// export tasks
exports.images = images;
// exports.css = css;
// exports.js = js;
// exports.jekyll = jekyll;
exports.clean = cleanTask;
// exports.build = build;
exports.build = build;
exports.serve = serve;
// exports.watch = watch;
exports.default = defaultTask;
exports.browserSync = browserSyncTask;
exports.customCss = newSassTask;