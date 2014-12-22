var gulp = require('gulp');
var builder = require('gulp-build-atom-shell');
gulp.task('build-atomshell', function () {
    builder.build( function () {
        console.log("build finished.");
    });
});

gulp.task('download-atomshell', function () {
    builder.download('0.20.1', function () {
        console.log("download finish.");
    });
});

gulp.task('default', ['download-atom'], function() {
    console.log("download finish by default");
});
