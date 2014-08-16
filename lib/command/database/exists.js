module.exports = function exists(info, req, next) {
  var scope = this, log = this.log;
  var verbose = this.verbose === true;
  var print = require('../../util/print').bind(this);
  var opts = {db: this.database};
  req.db().db.info(opts, function(err, res, doc) {
    var code = res && res.statusCode ? res.statusCode : 500;
    if(code !== 200 && code !== 404) {
      doc = req.db().getErrorDocumentByStatusCode(code);
    }
    req.db.add(req, err, res, null, doc);
    if(err && code !== 200 && code !== 404) return req.error(err, next);
    doc = {ok: res.statusCode === 200, status: code};
    print(doc, req, next);
  })
}