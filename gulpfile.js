var gulp = require('gulp');
var package = require('./package.json');
var plugins = require("gulp-load-plugins")({lazy:false});

gulp.task('scripts', function(){
    //combine all js files of the app
    gulp.src(['!./app/**/*_test.js','./app/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('templates',function(){
    //combine all template files of the app into a js file
    gulp.src(['!./app/index.html',
        './app/**/*.html'])
        .pipe(plugins.angularTemplatecache('templates.js',{standalone:true}))
        .pipe(gulp.dest('./build'));
});

gulp.task('css', function(){
    gulp.src('./app/**/*.css')
        .pipe(plugins.concat('app.css'))
        .pipe(gulp.dest('./build'));
});

gulp.task('vendorJS', function(){
    //concatenate vendor JS files
    plugins.bowerFiles({includeDev: true})
        .pipe(plugins.filter('**/*.js'))
        .pipe(plugins.concat('lib.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('vendorCSS', function(){
    //concatenate vendor CSS files
    plugins.bowerFiles({includeDev: true})
        .pipe(plugins.filter('**/*.css'))
        .pipe(plugins.concat('lib.css'))
        .pipe(gulp.dest('./build'));
});

gulp.task('copy-index', function() {
    gulp.src('./app/index.html')    
        .pipe(gulp.dest('./build'));
});

gulp.task('watch',function(){
    gulp.watch([
        'build/**/*.html',        
        'build/**/*.js',
        'build/**/*.css'        
    ], function(event) {
        return gulp.src(event.path)
            .pipe(plugins.connect.reload());
    });
    gulp.watch(['./app/**/*.js','!./app/**/*test.js'],['scripts']);
    gulp.watch(['!./app/index.html','./app/**/*.html'],['templates']);
    gulp.watch('./app/**/*.css',['css']);
    gulp.watch('./app/index.html',['copy-index']);
    gulp.watch('./bower_components/**/*.js', ['vendorJS']);
    gulp.watch('./bower_components/**/*.css', ['vendorCSS']);
});

gulp.task('connect', plugins.connect.server({
    root: ['build'],
    port: 9000,
    livereload: true
}));

gulp.task('war', function () {
    gulp.src('./build/**/*.*')
        .pipe(plugins.war({
            welcome: 'index.html',
            displayName: 'Dev9 Demo App'
        }))
        .pipe(plugins.zip(package.name + '.war'))
        .pipe(gulp.dest("./dist"));
});

gulp.task('buildmain', ['scripts', 'templates', 'css', 'copy-index', 'vendorJS', 'vendorCSS']);
gulp.task('dist', ['buildmain', 'war']);
gulp.task('default',['connect','buildmain','watch']);
