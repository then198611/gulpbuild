var gulp = require('gulp'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    fileinclude = require('gulp-file-include'),
    rev = require('gulp-rev'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    revCollector = require('gulp-rev-collector'),
    browserSync = require('browser-sync').create();


gulp.task('less',function(){
    return gulp.src('app/styles/**/*.less')
        .pipe(autoprefixer('last 5 version'))
        .pipe(less({compress : true}))
        .pipe(gulp.dest('dist/css'))
})

gulp.task('css',['less'],function(){
    return gulp.src('dist/css/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('dist/styles'))
        .pipe(rev.manifest() )
        .pipe(gulp.dest('dist/rev/less'))
        //.pipe(browserSync.stream());
})

gulp.task('uglify',function(){
    return gulp.src('app/scripts/**/*.js')
        .pipe(rev())
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rev.manifest() )
        .pipe(gulp.dest('dist/rev/js'))
        //.pipe(browserSync.stream());
})

gulp.task('image',function(){
    return gulp.src('app/images/**/*.{jpg,jpeg,png,gif}')
        .pipe(rev())
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true, multipass: true}))
        .pipe(gulp.dest('dist/images'))
        .pipe(rev.manifest() )
        .pipe(gulp.dest('dist/rev/image'))
        //.pipe(browserSync.stream());
})


gulp.task('html',['css','uglify','image'],function(){
    return gulp.src(['dist/rev/**/*.json','app/views/*.html'])
        .pipe(fileinclude())
        .pipe( revCollector({
            replaceReved: true
        }) )
        .pipe(gulp.dest('dist/views'))
        .pipe(browserSync.stream());
})

gulp.task('del:rev',['html'],function(){
    return del(['dist/rev','dist/css']);
})

gulp.task('clean',function(){
    return del('dist/*').then(function(){
        gulp.start('del:rev')
    })
})
gulp.task('build',['clean']);

gulp.task('watch',['build'],function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        port : 8522

    });

    gulp.watch(['app/styles/**/*.less','app/scripts/**/*.js','app/images/**/*','app/views/**/*.html'],['build'])
})

