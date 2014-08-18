var qs = require('../../util/couch').querystring;

module.exports = function rm(info, req, next) {
  var print = require('../../util/print').bind(this);
  var rev = this.rev;
  var opts = {db: this.database, id: this.id};
  if(!opts.db) {
    return req.error(this.errors.EDATABASE, next);
  }
  if(!opts.id) {
    return req.error(this.errors.EID, next);
  }
  if(rev) {
    opts.qs = qs.stringify({
      rev: rev
    });
  }
  var dbh = req.db();
  dbh.db.doc.rm(opts, function(err, res, doc) {
    if(req.auth(info, req, err, dbh)) {
      return;
    }
    req.db.add(req, err, res, opts, doc);
    if(err) return req.error(err, next);
    print(doc, req, next);
  })
}