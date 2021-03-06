var expect = require('chai').expect;

function result(doc) {
  expect(doc.total_rows).to.be.a('number');
  expect(doc.offset).to.be.a('number');
  expect(doc.rows).to.be.an('array');
  expect(doc.rows.length).to.be.gt(0);
}

function temp(doc) {
  expect(doc).to.be.an('object');
  expect(doc.rows).to.be.an('array');
}

module.exports = {
  result: result,
  temp: temp,
}
