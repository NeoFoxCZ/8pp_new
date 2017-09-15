var fs = require('fs');
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var gutil = require("gulp-util");
var path = require('path');
const mainstyle = 'assets/sass/main.scss';


gulp.task('sass', function() {
  gulp.src('./assets/sass/main.scss')
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('./assets/css/')).on('end', function() { gulp.start('css'), gutil.log('minifikace provedena')})
});

gulp.task('css', function() {
  gulp.src('./assets/css/main.css')
    .pipe(cleanCSS())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./assets/css/'))
    .pipe(browserSync.stream());
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "."
        }
    });
});

gulp.task('html', function() {
        browserSync.reload();
});

//** For HTML files (standart)
gulp.task('default', ['dev:style-route', 'sass', 'css', 'serve' ], function() {
  gulp.watch(['./assets/sass/*.s*ss', './assets/sass/**/*.s*ss'], ['sass']);
  gulp.watch(['./*.html'], ['html']);
});

//** when using XAMP or MAMP
gulp.task('phpdevel', ['sass', 'css'], function() {
    gulp.watch(['./assets/sass/*.s*ss', './assets/sass/**/*.s*ss'], ['sass']);
});


gulp.task('dev:style-route', function () {
    var dir = 'assets/sass';
    var comment = '/* generated source files */';
    function getStyleFilesPreload() {
        fs.truncate('assets/sass/main.scss', 0, function(){
            fs.open('assets/sass/main.scss', 'a', 666, function( e, id ) {
                var editDate = new Date();
                fs.write( id, comment + '\n' + '/*' + ' Last modification: '  + editDate + ' , ©Lukáš Műller, 2017 */ ' +'\n', null, 'utf8', function(){
                    fs.close(id, function(){
                    });
                });
            });
            getStyleFiles(dir);
        });
    }
    function getStyleFiles (dir, files_){
        files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files){
            var name = dir + '/' + files[i];
            var nameclear = '/' + files[i];
            if ((path.extname(nameclear) === ('.scss') & path.basename(name) === ('variables.scss'))){
                // DEBUG Config
                //console.log(name);
                //console.log(path.basename(name));
                //console.log(nameclear);
                //fs.write(destination, name, "a");
                fs.appendFileSync('assets/sass/main.scss','/* STYLE */ @import "./' + name +'";' + '\n');
            } else if ((path.extname(nameclear) === ('.scss') & path.basename(name) !== ('main.scss') )){
                // DEBUG SCSS
                //console.log(name);
                //console.log(path.basename(name));
                //console.log(nameclear);
                //fs.write(destination, name, "a");
                fs.appendFileSync('assets/sass/main.scss','@import "./' + name +'";' + '\n');
            } else if ((path.extname(nameclear) === ('.sass') & path.basename(name) !== ('main.scss'))){
                // DEBUG SASS
                //console.log(name);
                //console.log(path.basename(name));
                //console.log(nameclear);
                //fs.write(destination, name, "a");
                fs.appendFileSync('assets/sass/main.scss','@import "./' + name +'";' + '\n');
            }
            if (fs.statSync(name).isDirectory()){
                getStyleFiles(name, files_);
            }
        }
    }
    getStyleFilesPreload();
});

//** todoit: sourcemaps, js compile
