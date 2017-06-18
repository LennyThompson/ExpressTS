var gulp = require("gulp");
var ts = require("gulp-typescript");
var sass = require("gulp-sass");

var tsProject = ts.createProject("tsconfig.json");


gulp.task("copy-templates", function() {
    gulp.src("./views/*.pug")
    // Perform minification tasks, etc here
        .pipe(gulp.dest("./dist/views/"));
});

gulp.task("sass", function () {
    return gulp.src("./public/stylesheets/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./dist/stylesheets"));
});

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});
