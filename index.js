var parseRepo = require('github-repo-from-config');
var downloader = require('gulp-download-fire-shell');
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var path = require('path');
var fs = require('fs');
var wrench = require('wrench');
var projectPath = path.join(__dirname, '..', '..');
var atomshellPath = path.join(projectPath, '..', 'atom-shell');

module.exports = {
  build: function(callback) {
    console.log("enter build.");
    // var versionPattern = /^v\d+\.\d+\.\d+$/;
    // if (!versionPattern.test(version)) {
    //   throw new Error("invalid version format, please use 'vX.X.X' as version input.");
    // }
    prepareAtomshellRepo(function() {
      //      checkoutVersion(version, function() {
      bootstrapAtomshell(function() {
        buildAtomshell(function() {
          copyBinarySync();
          gutil.log(gutil.colors.green("Build atom-shell finished.\n"), "Atom binary created at ", gutil.colors.cyan(path.join(projectPath, 'bin/')));
          callback();
        });
      });
      //});
    });
  },
  download: function(verNum, callback) {
    console.log("enter downloader");
    downloader({
      version: verNum,
      outputDir: 'bin'
    }, function() {
      gutil.log(gutil.colors.green("Download atom-shell finished.\n"), "Atom binary created at ", gutil.colors.cyan(path.join(projectPath, 'bin/')));
      callback();
    });
  }
};

function prepareAtomshellRepo(cb) {
  if (atomshellRepoExist()) { //update repo
    updateAtomshellRepo(cb);
  } else {
    cloneAtomshellRepo(cb);
  }
}

function cloneAtomshellRepo(cb) {
  if (fs.existsSync(atomshellPath)) {
    wrench.rmdirSyncRecursive(atomshellPath);
  }

  var stream = shell([
    'git clone https://github.com/fireball-x/atom-shell.git'
  ], {
    cwd: path.join(atomshellPath, '..')
  });
  stream.write(process.stdout);
  stream.end();
  stream.on('finish', cb);
  return stream;
}

function updateAtomshellRepo(cb) {
  var stream = shell([
    'git reset --hard HEAD',
    'git checkout master',
    'git pull origin'
  ], {
    cwd: atomshellPath
  });
  stream.write(process.stdout);
  stream.end();
  stream.on('finish', cb);
  return stream;
}

function checkoutVersion(version, cb) {
  var stream = shell([
    'git checkout ' + version
    //'git reset --hard HEAD'
  ], {
    cwd: atomshellPath
  });
  stream.write(process.stdout);
  stream.end();
  stream.on('finish', cb);
  return stream;
}

function atomshellRepoExist() {
  var pathToCheck = atomshellPath;
  var result;
  if (!fs.existsSync(pathToCheck)) {
    result = false;
  } else {
    pathToCheck = path.join(atomshellPath, '.git/config');
    var info = parseRepo(fs.readFileSync(pathToCheck));
    if (info.path === "fireball-x/atom-shell") {
      return true;
    } else {
      result = false;
    }
  }

  if (!result) {
    gutil.log("No atom-shell repo found at: ", gutil.colors.cyan(atomshellPath), '\n', gutil.colors.red("This script will REMOVE existing atom-shell folder and clone the repo."));
    return result;
  }
}

function bootstrapAtomshell(cb) {
  var stream = shell([
    'python script/bootstrap.py -v'
  ], {
    cwd: atomshellPath
  });
  stream.write(process.stdout);
  stream.end();
  stream.on('finish', cb);
  return stream;
}

function buildAtomshell(cb) {
  var stream = shell([
    'python script/build.py -c Release -t all'
  ], {
    cwd: atomshellPath
  });
  stream.write(process.stdout);
  stream.end();
  stream.on('error', function(e) {
    throw new Error(e);
  });
  stream.on('finish', cb);
  return stream;
}

function copyBinarySync() {
  if (!fs.existsSync(path.join(projectPath, 'bin'))) {
    fs.mkdirSync('bin');
  }
  var appName = process.platform === 'darwin' ? 'Fireball.app' : 'fireball';
  var releasePath = path.join(atomshellPath, 'out', 'Release');
  wrench.copyDirSyncRecursive(
    path.join(releasePath, appName),
    path.join(projectPath, 'bin', appName), {
      forceDelete: true,
      excludeHiddenUnix: false,
      inflateSymlinks: false
    });
}
