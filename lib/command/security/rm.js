module.exports = function rm(info, req, next) {
  var opts = req.db.options({db: this.database});
  if(!opts.db) {
    return req.error(this.errors.EDATABASE_REQUIRED, req, next);
  }
  opts.body = {};
  var dbh = req.db();
  dbh.db.security().set(opts, function(err, res, doc) {
    if(req.auth(info, req, err)) {
      return;
    }
    if(err) return req.error(err, req, next);
    req.print(doc, req, next);
  })
}