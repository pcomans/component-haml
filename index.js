var Haml = require('haml');
var path = require('path');
var async = require('async');

module.exports = function(builder) {
  builder.hook('before scripts', function(pkg, next) {
    // No styles in this package
    if (!pkg.config.styles) return next();

    // Get all the scss files from the scripts list
    var hamlfiles = pkg.config.templates.filter(function(file) {
      return path.extname(file) === '.haml';
    });

    // No sass files
    if (hamlfiles.length === 0) return next();

    // Sass load paths
    var loadPaths = (pkg.config.paths || [])
      .map(pkg.path, pkg)
      .concat(pkg.globalLookupPaths);

    // Compile them all
    async.each(hamlfiles, function(file, cb) {
      var fun = Haml.compile(file);

      pkg.removeFile('templates', file);
      pkg.addFile('templates', path.basename(file, path.extname(file)) + '.js', fun);

      cb();
    }, next);
  });
};
