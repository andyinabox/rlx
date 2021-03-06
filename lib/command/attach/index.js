var ls = require('./ls');

module.exports = function attach(info, req, next){
  if(!info.args.length) {
    return ls.call(this, info, req, next);
  }
  //console.dir(info);
  info.validate(function response(err, parameters) {
    if(err) return req.error(err, req, next, parameters);
    next(info.cmd.commands());
  })
}
