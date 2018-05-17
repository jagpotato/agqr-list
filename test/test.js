var chai = require('chai')
var assert = chai.assert
var agqr = require('../lib/index')

describe('test name', function () {
  it('agqr', function () {
    assert.strictEqual(agqr.getList(), 'agqr-list')
  })
})