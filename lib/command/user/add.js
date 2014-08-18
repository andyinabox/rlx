var userdb = require('./userdb');
var template = require('../../util/template');
var validate = require('../../util/validate');
var descriptor = require('../../util/schema/user');

module.exports = function add(info, req, next) {
  var print = require('../../util/print').bind(this);
  var name = this.template || 'user/new';
  var opts = {db: this.database || userdb.default};
  var dbh = req.db();
  template.list.call(this, req, function(err, list, unique) {
    if(err) return next(err);
    var tpl = template.find(name, unique);
    if(!tpl) {
      return next(errors.EUNKNOWN_TEMPLATE, [name]);
    }
    req.vars.name = userdb.strip(this.username || req.vars.name);
    req.vars.id = userdb.id(req.vars.name);
    req.vars.password = this.password || req.vars.password;
    req.vars.roles = req.vars.roles || [];
    template.parse.call(this, tpl.file, req, function(err, doc) {
      if(err) return req.error(err);
      validate.call(this, doc, descriptor, function(errors, fields) {
        if(errors && errors.length) {
          return req.error(errors[0], next);
        }
        opts.id = doc._id;
        opts.body = doc;
        dbh.db.doc.save(opts, function(err, res, doc) {
          if(req.auth(info, req, err, dbh)) {
            return;
          }
          req.db.add(req, err, res, opts, doc);
          if(err) return req.error(err, next);
          print(doc, req, next);
        })
      })
    })
  })
}