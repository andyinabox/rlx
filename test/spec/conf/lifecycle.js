var qt = require('../../fixtures/qt');

var config = require('../../util/config');
var pkg = config.paths.pkg;
var program = config.program;
var assert = config.assert.conf;

describe('rlx:', function() {
  it('should get config', function(done){
    var mock = config.file('server-config.json');
    var args = qt.getArguments('conf/get', {output: mock});
    var def = program(require(pkg), config.name)
    def.program.on('complete', function(req) {
      var doc = config.json(mock);
      assert.all(doc);
      done();
    })
    def.parse(args);
  });

  it('should set config value', function(done){
    var mock = config.file('server-config-set-value.json');
    var args = qt.getArguments('conf/set', {output: mock});
    var def = program(require(pkg), config.name)
    def.program.on('complete', function(req) {
      var doc = config.json(mock);
      assert.set(doc);
      done();
    })
    def.parse(args);
  });

  it('should get config section', function(done){
    var mock = config.file('server-config-section.json');
    var args = qt.getArguments('conf/get/section', {output: mock});
    var def = program(require(pkg), config.name)
    def.program.on('complete', function(req) {
      var doc = config.json(mock);
      assert.section(doc);
      done();
    })
    def.parse(args);
  });
  it('should get config section value', function(done){
    var mock = config.file('server-config-section-value.json');
    var args = qt.getArguments('conf/get/section/key', {output: mock});
    var def = program(require(pkg), config.name)
    def.program.on('complete', function(req) {
      var doc = config.json(mock);
      assert.value(doc);
      done();
    })
    def.parse(args);
  });
  it('should remove config value', function(done){
    var mock = config.file('server-config-rm-value.json');
    var args = qt.getArguments('conf/rm', {output: mock});
    var def = program(require(pkg), config.name)
    def.program.on('complete', function(req) {
      var doc = config.json(mock);
      assert.rm(doc);
      done();
    })
    def.parse(args);
  });
})
