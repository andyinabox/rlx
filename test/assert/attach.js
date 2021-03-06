var expect = require('chai').expect;
var mock = require('../util/mock');

function up(doc, id, len) {
  var item;
  id = id || mock.document.id;
  expect(doc).to.be.an('array');
  if(!len) {
    expect(doc.length).to.be.gt(0);
  }else{
    expect(doc.length).to.eql(len);
  }
  for(var i = 0;i < doc.length;i++) {
    item = doc[i];
    expect(item).to.be.an('object');
    expect(item.ok).to.eql(true);
    expect(item.id).to.eql(id);
    expect(item.rev).to.be.a('string');
  }
}

function rm(doc, id) {
  id = id || mock.document.id;
  expect(doc).to.be.an('object');
  expect(doc.ok).to.eql(true);
  expect(doc.id).to.eql(id);
  expect(doc.rev).to.be.a('string');
}

function dlitem(doc) {
  expect(doc).to.be.an('object');
  expect(doc.code).to.eql(200);
  expect(doc.id).to.be.a('string');
  expect(doc.rev).to.be.a('string');
  expect(doc.name).to.be.a('string');
  expect(doc.file).to.be.a('string');
  expect(doc.attachment).to.be.an('object');
}

function dl(doc, len) {
  len = len || 1;
  expect(doc).to.be.an('array');
  expect(doc.length).to.eql(len);
  doc.forEach(function(item) {
    dlitem(item);
  })
}

function head(doc) {
  expect(doc).to.be.an('object');
  expect(doc.name).to.be.a('string');
  expect(doc.size).to.be.a('number');
  expect(doc.type).to.be.a('string');
  //expect(doc.md5).to.be.a('string');
}

function get(doc) {
  expect(doc).to.be.an('object');
  expect(doc.revpos).to.be.a('number');
  expect(doc.length).to.be.a('number');
  expect(doc.stub).to.be.a('boolean');
  expect(doc.content_type).to.be.a('string');
  expect(doc.digest).to.be.a('string');
}

function list(doc, id) {
  expect(doc).to.be.an('object');
  var attachment = doc[id];
  get(attachment);
}

module.exports = {
  up: up,
  dl: dl,
  head: head,
  get: get,
  rm: rm,
  list: list,
}
