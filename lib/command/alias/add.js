var alias = require('../../util/alias');
var stringify = require('../../util/stringify');
var write = require('../../util/write');

module.exports = function add(info, req, next){
  if(!info.args.length) {
    return req.error(
      this.errors.ETOO_FEW_ARGUMENTS, req, next, [info.cmd.extra()]);
  }
  var aliases = this.configure().alias
    , file = req.dirs.user.alias
    , conf = this.configure();
  if(aliases === false) {
    return req.error(
      this.errors.EALIAS_FILE_REQUIRED, req, next,
      [file, 'alias init']);
  }
  var as = alias.strip(req, info.args[0]);
  var doc = alias.find.call(this, as, aliases);
  if(doc && !this.force) {
    return req.error(this.errors.EALIAS_EXISTS, req, next,
      [as, this.options().force.toString(null)]);
  }

  var src = req.result.options;

  // add from current location in interactive
  if(info.args.length === 1
    && conf.interactive
    && !req.result.options.server
    && !req.result.options.database
    && !req.result.options.id
    && !req.result.options.rev
    && !req.result.options.username) {
    src = conf.location;
  }

  doc = {alias: alias.build.call(this, src)};
  if(!Object.keys(doc.alias).length) {
    return req.error(this.errors.EALIAS_EMPTY, req, next, [as]);
  }
  doc.file = file;
  aliases[as] = doc.alias;
  var opts = {output: file};
  var contents = stringify(aliases, null, req.rc.indent);
  write.call(this, contents, req, opts, function(err) {
    if(err) return req.error(err, req, next);
    doc.ok = true;
    // for show only, the key is the name
    doc.alias.name = as;
    req.print(doc, req, next);
  })
}
