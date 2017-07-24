const path         = require('path');
const gulpif       = require('gulp-if');
const wait         = require('gulp-wait');
const pug          = require('gulp-pug');
const prettify     = require('gulp-html-prettify');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso         = require('gulp-csso');
const sourcemaps   = require('gulp-sourcemaps');
const changed      = require('gulp-changed');
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant');
const browserSync  = require('browser-sync');
const handleErrors = require('blendid/gulpfile.js/lib/handleErrors');

module.exports = {
  images:    false,
  fonts:     true,
  static:    true,
  svgSprite: false,
  ghPages:   true,

  html: {
    alternateTask(gulp, PATH_CONFIG, TASK_CONFIG) {
      return () => {
        const paths = {
          src:  path.resolve(process.env.PWD, PATH_CONFIG.src,  PATH_CONFIG.html.src),
          dest: path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.html.dest),
        };
        return gulp
          .src(path.resolve(paths.src, '*.pug'))
          .pipe(pug({
            locals: require(path.resolve(paths.src, 'data/main.json')),
          }))
          .on('error', handleErrors)
          .pipe(gulpif(global.production, prettify({ indent_size: 2 })))
          .pipe(gulp.dest(paths.dest))
          .pipe(gulpif(!global.production, browserSync.stream()));
      };
    },
    extensions: ['pug'],
  },

  stylesheets: {
    alternateTask(gulp, PATH_CONFIG, TASK_CONFIG) {
      return () => {
        const paths = {
          src:  path.resolve(process.env.PWD, PATH_CONFIG.src,  PATH_CONFIG.stylesheets.src, `**/*.{${TASK_CONFIG.stylesheets.extensions}}`),
          dest: path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.stylesheets.dest),
        };
        return gulp
          .src(paths.src)
          .pipe(wait(500))
          .pipe(gulpif(!global.production, sourcemaps.init()))
          .pipe(sass(TASK_CONFIG.stylesheets.sass))
          .on('error', handleErrors)
          .pipe(autoprefixer())
          .pipe(gulpif(global.production, csso()))
          .pipe(gulpif(!global.production, sourcemaps.write()))
          .pipe(gulp.dest(paths.dest))
          .pipe(browserSync.stream());
      };
    },
  },

  javascripts: {
    entry: {
      // files paths are relative to
      // javascripts.dest in path-config.json
      app: ['./app.js'],
    },
  },

  browserSync: {
    server: {
      // should match `dest` in
      // path-config.json
      baseDir: 'dist',
    },
    notify: false,
  },

  production: {
    rev: false,
  },

  additionalTasks: {
    initialize(gulp, PATH_CONFIG, TASK_CONFIG) {
      gulp.task('images', () => {
        const paths = {
          src:  path.resolve(process.env.PWD, PATH_CONFIG.src,  PATH_CONFIG.images.src, '**/*'),
          dest: path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.images.dest),
        };
        return gulp
          .src(paths.src)
          .pipe(changed(paths.dest))
          .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
          }))
          .pipe(gulp.dest(paths.dest));
      });
    },
    development: {
      // prebuild: [],
      postbuild: ['images'],
    },
    production: {
      // prebuild: [],
      postbuild: ['images'],
    },
  },
};
