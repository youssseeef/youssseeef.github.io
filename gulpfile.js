var gulp = require("gulp");
var plumber = require("gulp-plumber");
var uglify = require("gulp-uglify");
var sass = require("gulp-sass");
var wait = require("gulp-wait");
var rename = require("gulp-rename");
const connect = require("gulp-connect");
var autoprefixer = require("gulp-autoprefixer");
gulp.task("webserver", function() {
  connect.server({
    livereload: true
  });
});
gulp.task("index", function() {
  return gulp.src(["./index.html"]).pipe(connect.reload());
})
gulp.task("scripts", function() {
  return gulp
    .src("js/scripts.js")
    .pipe(
      plumber(
        plumber({
          errorHandler: function(err) {
            console.log(err);
            this.emit("end");
          }
        })
      )
    )
    .pipe(
      uglify({
        output: {
          comments: "/^!/"
        }
      })
    )
    .pipe(rename({ extname: ".min.js" }))
    .pipe(gulp.dest("js"))
    .pipe(connect.reload());
});

gulp.task("styles", function() {
  return gulp
    .src("./scss/styles.scss")
    .pipe(wait(250))
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("./css"))
    .pipe(connect.reload());
});

gulp.task("watch", function() {
  gulp.watch("js/scripts.js", gulp.series("scripts"));
  gulp.watch("index.html", gulp.series("index"));
  gulp.watch("scss/styles.scss", gulp.series("styles"));
});

gulp.task("default",  gulp.parallel("watch", "webserver"));

