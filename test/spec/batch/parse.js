var expect = require('chai').expect;
var mock = require('../../util/mock');
var fsutil = require('../../util/fsutil');

var parse = require('../../../lib/util/batch').parse;

describe('rlx:', function() {
  this.timeout(5000);
  it('should parse batch file', function(done){
    var file = fsutil.batchfile('info.js');
    parse({file: file}, function(err, batch) {
      expect(err).to.eql(null);
      expect(batch).to.be.an('object')
      expect(batch.exec).to.be.an('array');
      expect(batch.options.bail).to.eql(true);
      expect(batch.options.server).to.eql(mock.server.default);
      expect(batch.options.database).to.eql(mock.database.default);

      //console.dir(batch.exec[0]);

      var exec = batch.exec[0], cmd;
      expect(exec).to.be.an('object');
      expect(exec.cmd).to.be.an('array');
      cmd = exec.cmd;
      expect(cmd).to.be.an('array');
      expect(cmd[0]).to.eql('info');
      expect(cmd[1]).to.eql('--server');
      expect(cmd[2]).to.eql(mock.server.default);
      done();
    });
  });

  it('should parse batch file (array)', function(done){
    var file = fsutil.batchfile('info-array.js');
    parse({file: file}, function(err, batch) {
      expect(err).to.eql(null);
      expect(batch).to.be.an('object')
      expect(batch.exec).to.be.an('array');
      expect(batch.options.bail).to.eql(true);
      expect(batch.options.server).to.eql(mock.server.default);
      expect(batch.options.database).to.eql(mock.database.default);

      //console.dir(batch.exec[0]);

      var exec = batch.exec[0], cmd;
      expect(exec).to.be.an('object');
      expect(exec.cmd).to.be.an('array');
      cmd = exec.cmd;
      expect(cmd).to.be.an('array');
      expect(cmd[0]).to.eql('info');
      expect(cmd[1]).to.eql('--server');
      expect(cmd[2]).to.eql(mock.server.default);
      done();
    });
  });


  it('should override default server', function(done){
    var file = fsutil.batchfile('info-override.js');
    parse({file: file}, function(err, batch) {
      expect(err).to.eql(null);
      expect(batch).to.be.an('object')
      expect(batch.exec).to.be.an('array');
      expect(batch.options.bail).to.eql(true);
      expect(batch.options.server).to.eql(mock.server.default);
      expect(batch.options.database).to.eql(mock.database.default);

      var exec = batch.exec[0], cmd;
      expect(exec).to.be.an('object');
      expect(exec.cmd).to.be.an('array');
      cmd = exec.cmd;
      expect(cmd).to.be.an('array');
      expect(cmd[0]).to.eql('info');
      expect(cmd[1]).to.eql('--server');
      expect(cmd[2]).to.eql(mock.server.secure);
      done();
    });
  });
})
