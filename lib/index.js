'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProgramList = getProgramList;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var URL = 'http://www.agqr.jp/timetable/streaming.html';

var sortByDay = function sortByDay(table, day) {
  if (day === 'All') {
    var response = {
      'Mon': [], 'Tue': [], 'Wed': [], 'Thu': [], 'Fri': [], 'Sat': [], 'Sun': []
    };
    for (var i = 0; i < table.length; i++) {
      if (table[i][0].start !== '') response['Mon'].push(table[i][0]);
      if (table[i][1].start !== '') response['Tue'].push(table[i][1]);
      if (table[i][2].start !== '') response['Wed'].push(table[i][2]);
      if (table[i][3].start !== '') response['Thu'].push(table[i][3]);
      if (table[i][4].start !== '') response['Fri'].push(table[i][4]);
      if (table[i][5].start !== '') response['Sat'].push(table[i][5]);
      if (table[i][6].start !== '') response['Sun'].push(table[i][6]);
    }
    return response;
  } else {
    var _response = [];
    for (var _i = 0; _i < table.length; _i++) {
      if (table[_i][0].start !== '' && day === 'Mon') _response.push(table[_i][0]);
      if (table[_i][1].start !== '' && day === 'Tue') _response.push(table[_i][1]);
      if (table[_i][2].start !== '' && day === 'Wed') _response.push(table[_i][2]);
      if (table[_i][3].start !== '' && day === 'Thu') _response.push(table[_i][3]);
      if (table[_i][4].start !== '' && day === 'Fri') _response.push(table[_i][4]);
      if (table[_i][5].start !== '' && day === 'Sat') _response.push(table[_i][5]);
      if (table[_i][6].start !== '' && day === 'Sun') _response.push(table[_i][6]);
    }
    return _response;
  }
};

var sortTableByDay = function sortTableByDay(timeTable, show) {
  var sortTable = [];
  var week = [];
  var timeCount = [0, 0, 0, 0, 0, 0, 0];
  var over = [false, false, false, false, false, false, false];
  var min = 0;

  var _loop = function _loop(i) {
    if (over[i % 7] === false) {
      timeCount[i % 7] = timeTable[i].time;
    } else {
      timeTable.splice(i, 0, { start: '', time: '', title: '' });
      // timeTable.splice(i, 0, timeTable[i - 7])
    }
    if (i % 7 === 6) {
      week = [];
      min = Math.min.apply(null, timeCount);
      timeCount = timeCount.map(function (value, index) {
        value -= min;
        if (over[index] === true) {
          week.push({ start: '', title: '' });
          // week.push({start: timeTable[i - (6 - index) - 7].start, title: timeTable[i - (6 - index) - 7].title})
        } else {
          week.push({ start: timeTable[i - (6 - index)].start, time: timeTable[i - (6 - index)].time, title: timeTable[i - (6 - index)].title });
        }
        over[index] = value === 0 ? false : true;
        return value;
      });
      sortTable.push(week);
    }
  };

  for (var i = 0; i < timeTable.length; i++) {
    _loop(i);
  }
  return sortByDay(sortTable, show);
};

var isDay = function isDay(show) {
  var dayList = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  if (dayList.indexOf(show) >= 0) {
    return true;
  } else {
    return false;
  }
};

function getProgramList(show) {
  return new Promise(function (resolve, reject) {
    var _show = show || 'All';
    if (isDay(_show) === false) {
      reject('invalid argument');
    }
    (0, _request2.default)(URL, function (error, response, body) {
      if (error) {
        reject(error);
      }
      var $ = _cheerio2.default.load(body, { decodeEntities: false });
      var timeTable = [];
      $('td').children('.title-p').each(function (i, elem) {
        if (/^\n$/.test(elem.children[0].data) === true) {
          timeTable.push({ start: '', time: '', title: elem.children[1].children[0].data.match(/[^\n]+/)[0] });
        } else {
          timeTable.push({ start: '', time: '', title: elem.children[0].data.match(/[^\n]+/)[0] });
        }
      });
      $('td').children('.time').each(function (i, elem) {
        timeTable[i].start = elem.children[0].data.match(/[0-9:]+/)[0];
      });
      $('td[class^=bg-]').each(function (i, elem) {
        timeTable[i].time = elem.attribs.rowspan;
      });
      timeTable = sortTableByDay(timeTable, _show);
      resolve(timeTable);
    });
  });
}
