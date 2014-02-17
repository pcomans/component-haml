var sass = require('node-sass');
var path = require('path');
var async = require('async');

module.exports = function(builder) {
  builder.hook('before styles', function(pkg, next) {
    // No styles in this package
    if (!pkg.config.styles) return next();

    // Get all the scss files from the scripts list
    var sassfiles = pkg.config.styles.filter(function(file) {
      return path.extname(file) === '.scss';
    });

    // No sass files
    if (sassfiles.length === 0) return next();

    // Sass load paths
    var loadPaths = (pkg.config.paths || [])
      .map(pkg.path, pkg)
      .concat(pkg.globalLookupPaths);

    // Compile them all
    async.each(sassfiles, function(file, cb) {
      var css = sass.renderSync({
        file: pkg.path(file),
        includePaths: loadPaths
      });

      pkg.removeFile('styles', file);
      pkg.addFile('styles', path.basename(file, path.extname(file)) + '.css', css);

      cb();
    }, next);
  });
};
