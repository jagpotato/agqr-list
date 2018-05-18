var chai = require('chai')
var expect = chai.expect
var agqr = require('../lib/index')

describe('getProgramList test', function () {
  it('expect to return a program object of all days when an argument is empty', function () {
    return agqr.getProgramList()
      .then(function (list) {
        expect(list).to.have.all.keys('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')
      })
  })
  it('expect to return a program object of all days when an argument is \'All\'', function () {
    return agqr.getProgramList('All')
      .then(function (list) {
        expect(list).to.have.all.keys('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')
      })
  })
  it('expect to return a program array when an argument is a day name', function () {
    var input = 'Tue'
    var program = {start: '27:00', time: '30', title: '学園祭学園プレゼンツ　喋れ！学園祭'}
    return agqr.getProgramList(input)
      .then(function (list) {
        expect(list).to.be.an('array').that.deep.include(program)
      })
  })
  it('expect to not return a program array other than a day given as an argument', function () {
    var input = 'Fri'
    var program = {start: '27:00', time: '30', title: '学園祭学園プレゼンツ　喋れ！学園祭'}
    return agqr.getProgramList(input)
      .then(function (list) {
        expect(list).to.be.an('array').that.not.include(program)
      })
  })
  it('expect to reject when an argument is invalid string', function () {
    var input = 'Hello World'
    var message = 'invalid argument'
    return agqr.getProgramList(input)
      .then(function (list) {
        throw new Error('was not rejected')
      }, function (error) {
        expect(error).to.equal(message)
      })
  })
})