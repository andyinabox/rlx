module.exports = function set(info, req, next) {
  var scope = this, log = this.log;
  var verbose = this.verbose === true;
  var print = require('../../util/print').bind(this);
  var opts = {};
  opts.username = this.username || info.args[0];
  opts.password = this.password || info.args[1];
  if(!opts.username) return next(this.errors.EUSERNAME_REQUIRED);
  if(!opts.password) return next(this.errors.EPASSWORD_REQUIRED);
  req.db().session.set(opts, function(err, res, doc) {
    req.db.add(req, err, res, opts, doc);
    if(err) return req.error(err, next);
    print(doc, req, next);
  })
}