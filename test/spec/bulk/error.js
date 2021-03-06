var qt = require('../../fixtures/qt');
var setup = require('../../util/setup');
var teardown = require('../../util/teardown');

var config = require('../../util/config');
var pkg = config.paths.pkg;
var program = config.program;

describe('rlx:', function() {

  it('should error on no subcommand', function(done){
    var args = qt.getArguments('bulk');
    var def = program(require(pkg), config.name)
    var errors = def.program.errors;
    def.program.on('error', function(err) {
      config.error.nosub(err, errors);
      done();
    })
    def.parse(args);
  });

  it('should error on push with no database', function(done){
    var args = qt.getArguments('bulk/push/nodb');
    var def = program(require(pkg), config.name)
    var errors = def.program.errors;
    def.program.on('error', function(err) {
      config.error.db(err, errors);
      done();
    })
    def.parse(args);
  });

  it('should error on push with too few arguments', function(done){
    var args = qt.getArguments('bulk/push/empty');
    var def = program(require(pkg), config.name)
    var errors = def.program.errors;
    def.program.on('error', function(err) {
      config.error.few(err, errors);
      done();
    })
    def.parse(args);
  });

  it('should error on push with invalid directory', function(done){
    var args = qt.getArguments(
      'bulk/push/empty', {args: [config.paths.security]});
    var def = program(require(pkg), config.name)
    var errors = def.program.errors;
    def.program.on('error', function(err) {
      config.error.dir(err, errors);
      done();
    })
    def.parse(args);
  });

})
