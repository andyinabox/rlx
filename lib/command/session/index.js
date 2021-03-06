var get = require('./get');

module.exports = function session(info, req, next){
  if(!info.args.length) {
    return get.call(this, info, req, next);
  }
  info.validate(function response(err, parameters) {
    if(err) return req.error(err, req, next, parameters);
    next(info.cmd.commands());
  })
}
