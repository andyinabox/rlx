var cli = require('cli-command');
var CliError = require('cli-error').CliError;
var ErrorDefinition = cli.error.ErrorDefinition;
var CouchError = require('cdb').CouchError;
var stringify = require('../util/stringify');

function getCouchReason(err) {
  return (err.doc.reason || '').toLowerCase().replace(/\.$/, '');
}

function getErrorArguments(key, err, req, args, err) {
  var options = this.options();
  var dbh = req.db();
  var last = dbh.peek();

  if(last) {
    switch(key) {
      case 'EMETHOD_NOT_ALLOWED':
        args = [last.err.res.req.method];
        break;
      case 'EUNKNOWN_CONFIG_VALUE':
        args = [last.opts.section, last.opts.key];
        break;
      case 'ENO_DB_FILE':
      case 'EILLEGAL_DATABASE_NAME':
      case 'EFILE_EXISTS':
        args = [last.opts.db];
        break;
      case 'ENOT_FOUND':
        // TODO: handle HEAD where resource not found is indeterminate
        args = [last.opts.ddoc || last.opts.id || last.opts.db];
        break;
      case 'EUNAUTHORIZED':
      case 'EFORBIDDEN':
      case 'EBAD_REQUEST':
        args = [getCouchReason(err)];
        break;
      case 'ECONFLICT':
        args = [last.opts.id, last.opts.db, getCouchReason(err)];
        break;
      case 'EDB_NOT_FOUND':
        args = [last.opts.db, getCouchReason(err)];
        break;
      case 'EQUERY_PARSE_ERROR':
      case 'EBAD_CONTENT_TYPE':
        args = [getCouchReason(err)];
        break;
      case 'EDELETED':
        args = [last.opts.db, last.opts.id];
        break;
      default:
        if(err.doc) {
          args = [typeof err.doc === 'string' ? err.doc : stringify(err.doc)];
        }
    }
  }

  switch(key) {
    case 'EREGEXP_COMPILE':
      if(err.cause()) {
        var msg = err.cause().message.substr(
          err.cause().message.lastIndexOf(':') + 1).trim().toLowerCase();
        err.parameters = (err.parameters || []).concat([msg]);
      }
      break;
    case 'ECONNREFUSED':
      args = [this.server];
      break;
    case 'EFS_FILE_EXISTS':
      args = [this.output, options.force.toString(null)];
      break;
    case 'ENO_SUBCOMMAND':
      args = [req.command.name];
      break;
    case 'ESERVER_REQUIRED':
      args = [options.server.toString(null)];
      break;
    case 'EDATABASE_REQUIRED':
      args = [options.database.toString(null)];
      break;
    case 'EID_REQUIRED':
      args = [options.id.toString(null)];
      break;
    case 'EDDOC_REQUIRED':
      args = [options.ddoc.toString(null)];
      break;
    case 'ENAME_REQUIRED':
      args = [options.nm.toString(null)];
      break;
    case 'EATTACHMENT_REQUIRED':
      args = [options.attachment.toString(null)];
      break;
    case 'ETEMPLATE_REQUIRED':
      args = [options.template.toString(null)];
      break;
    case 'EDOCUMENT_REQUIRED':
      args = [
        options.file.toString(null),
        options.json.toString(null)];
      break;
    case 'EOUTPUT_DIRECTORY':
      args = err.parameters;
      break;
    case 'EOUTPUT_REQUIRED':
      args = [options.output.toString(null)];
      break;
    case 'EFILE_REQUIRED':
      args = [options.file.toString(null)];
      break;
    case 'EHEADER_PARSE':
      args = [req.headers.invalid];
      break;
    case 'EDESTINATION_REQUIRED':
      args = [options.destination.toString(null)];
      break;
  }

  return args;
}

function error(err, req, next, parameters, stop) {
  var scope = this
    , conf = this.configure();
  var def = (err instanceof ErrorDefinition);
  var couch = (err instanceof CouchError);
  var args = Array.isArray(parameters)
    ? parameters : [].slice.call(arguments, 3);
  var key = err.key || err.code;

  //stop = stop || true;

  //console.log('req error called. %s', new Error().stack.split('\n'));

  //console.log('error callback %j', parameters);
  //console.dir(err);
  //console.dir(err.key)
  //console.dir(key);

  //if(typeof err.code === 'string') {
    //err.key = err.code;
  //}

  if(couch) key = err.getErrorKey();
  if(!parameters || !Array.isArray(parameters)) {
    args = getErrorArguments.call(this, key, err, req, args, err);
  }

  if(couch) {
    if(err.doc && err.doc.noop) {
      err = err.message;
      args = [];
      return next();
    }else if(this.errors[key]) {
      err = this.errors[key];
    }else{
      err = this.errors.EUNKNOWN_DB_ERROR;
    }
  // if has reason, is validation error
  }else if(typeof err.reason === 'object') {
    args = [err.message];
    err = this.errors.EVALIDATE;
  }else if(!def && (err.code && this.errors[err.code])) {
    err = this.errors[err.code];
  }

  // intercept when printing errors as json
  if(req.rc.error.json) {
    var e = this.wrap(err, args);
    var o = e.toObject(conf.trace);
    o.ok = false;
    //console.log('printing json error');
    return req.print(o, req, function() {
      //console.log('print completed');
      if(conf.exit) return e.exit();
      req.complete(e);
    });
  }

  if(stop) {
    this.raise(this.wrap(err, args));
    // halt processing and fire complete
    err.bail = true;
  }

  //console.dir('calling next');
  //console.dir(err);

  next(err, args);
}

module.exports = error;
