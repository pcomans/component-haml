var assert = require('assert');
var Builder = require('component-builder');
var sass = require('../');

describe('component-sass', function() {
  it('should pass-though if there are no SCSS files', function(done) {
    var builder = new Builder('test/fixtures/no-scss');
    builder.use(sass);

    builder.build(function(err, res) {
      if (err) return done(err);
      assert.equal(res.css.trim(), 'body {\n  color: red;\n}');
      done();
    });
  });

  it('should build SCSS files to css', function(done) {
    var builder = new Builder('test/fixtures/simple');
    builder.use(sass);

    builder.build(function(err, res) {
      if (err) return done(err);
      assert.equal(res.css.trim(), 'body {\n  color: red; }\n  body div {\n    display: block; }');
      done();
    });
  });

  it('should build with imported files', function(done) {
    var builder = new Builder('test/fixtures/multiple');
    builder.use(sass);

    builder.build(function(err, res) {
      if (err) return done(err);
      assert.equal(res.css.trim(), '.bar {\n  color: black; }\n\nbody {\n  content: "foo";\n  color: red; }\n  body div {\n    display: block; }');
      done();
    });
  });


  it('should build with imported component files', function(done) {
    var builder = new Builder('test/fixtures/with-import');
    builder.use(sass);

    builder.build(function(err, res) {
      if (err) return done(err);
      assert.equal(res.css.trim(), 'body {\n  content: "test";\n  color: red; }\n  body div {\n    display: block; }');
      done();
    });
  });
});
