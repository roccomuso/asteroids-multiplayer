var gulp = require('gulp');
//var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
    gulp.src(['app/src/lib/**/*.js', 'app/src/**/*.js']) // concat first the lib dir
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/build'))
})

gulp.task('styles', function() {
    gulp.src(['app/css/style.css'])
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/build'))
})

gulp.task('html', function() {
    gulp.src("app/*.html")
        .pipe(gulp.dest('dist/'))
})

gulp.task('assets', function(){
    gulp.src("app/assets/**/*")
        .pipe(gulp.dest('dist/assets'))
});


gulp.task('lr-server', function() { // live reload server
    browserSync.init({
        server: {
          baseDir: "dist/",
          directory: false
        },
        serveStatic: ['./dist'],
        open: false
    });
})

gulp.task('reload', function(done){
    browserSync.reload();
    done();
});

gulp.task('build', function(){
   gulp.run('scripts','styles','html', 'assets');
});

gulp.task('default', function() {
    gulp.run('lr-server', 'scripts', 'styles', 'html', 'assets', 'reload');

    gulp.watch('app/src/**', function(event) {
        gulp.run('scripts', 'reload');
    })

    gulp.watch('app/css/**', function(event) {
        gulp.run('styles', 'reload');
    })

    gulp.watch('app/**/*.html', function(event) {
        gulp.run('html', 'reload');
    })

    gulp.watch('app/assets/**/*', function(event) {
        gulp.run('assets', 'reload');
    })
})
