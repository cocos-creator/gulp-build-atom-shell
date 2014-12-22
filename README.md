# gulp-build-atom-shell
=====================

** Currently download release on windows does not work due to a [CERT_UNTRUSTED](https://github.com/atom/grunt-download-atom-shell/issues/17) error. **

gulp plugin for building atom-shell for Fireball project.

This is not a npm package that works for any atom-shell app. **It will get the source or release file from Fireball-x forked atom-shell repo.** 

The recommended folder structure:

<pre>
---fireball-x
   |-atom-shell (fireball-x forked repo)
   |-dev (fireball-x dev repo)
     |-bin (atom-shell will be built or downloaded here)
     |-gulpfile.js (gulp file that run this plugin)
</pre>

[Fireball-x forked atom-shell](https://github.com/fireball-x/atom-shell) has product name, framework name and icons replaced with Fireball. It will also contains any future extensions to atom-shell. 

This plugin will build from source of this forked repo or download atom-shell distribution from the release page of this forked repo.

## Install

Add this in your package.json:

``` javascript
  "devDependencies": {
    "gulp": "^3.8.10",
    "gulp-build-atom-shell": "fireball-x/gulp-build-atom-shell"
  }
```
And run:
``` bash
npm install
```

## To build atom-shell

Have your gulpfile include contents below: 
``` javascript
var gulp = require('gulp');
var builder = require('gulp-build-atom-shell');
gulp.task('build-atomshell', function () {
    builder.build( function () {
        console.log("build finished.");
    });
});
```

and run:
``` bash
gulp build-atomshell
```

## To download atom-shell

Add a task in your gulpfile:
``` javascript
var gulp = require('gulp');
var builder = require('gulp-build-atom-shell');
gulp.task('download', function(cb) {
  builder.download('0.20.1', function() {
    console.log("download finished.");
  });
});
```
The first parameter of builder.download is the version number of atom-shell. (without 'v')
And run:
``` bash
gulp download
```

In both ways, Fireball-x forked atom-shell distribution will be put into 'bin' folder of your project.
