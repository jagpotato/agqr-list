import request from 'request'
import cheerio from 'cheerio'

const URL = 'http://www.agqr.jp/timetable/streaming.html'

const sortByDay = (table, day) => {
  if (day === 'All') {
    const response = {
      'Mon': [], 'Tue': [], 'Wed': [], 'Thu': [], 'Fri': [], 'Sat': [], 'Sun': []
    }
    for (let i = 0; i < table.length; i++) {
      if (table[i][0].start !== '') response['Mon'].push(table[i][0])
      if (table[i][1].start !== '') response['Tue'].push(table[i][1])
      if (table[i][2].start !== '') response['Wed'].push(table[i][2])
      if (table[i][3].start !== '') response['Thu'].push(table[i][3])
      if (table[i][4].start !== '') response['Fri'].push(table[i][4])
      if (table[i][5].start !== '') response['Sat'].push(table[i][5])
      if (table[i][6].start !== '') response['Sun'].push(table[i][6])
    }
    return response
  } else {
    const response = []
    for (let i = 0; i < table.length; i++) {
      if (table[i][0].start !== '' && day === 'Mon') response.push(table[i][0])
      if (table[i][1].start !== '' && day === 'Tue') response.push(table[i][1])
      if (table[i][2].start !== '' && day === 'Wed') response.push(table[i][2])
      if (table[i][3].start !== '' && day === 'Thu') response.push(table[i][3])
      if (table[i][4].start !== '' && day === 'Fri') response.push(table[i][4])
      if (table[i][5].start !== '' && day === 'Sat') response.push(table[i][5])
      if (table[i][6].start !== '' && day === 'Sun') response.push(table[i][6])
    }
    return response
  }
}

const sortTableByDay = (timeTable, show) => {
  const sortTable = []
  let week = []
  let timeCount = [0, 0, 0, 0, 0, 0, 0]
  let over = [false, false, false, false, false, false, false]
  let min = 0
  for (let i = 0; i < timeTable.length; i++) {
    if (over[i % 7] === false) {
      timeCount[i % 7] = timeTable[i].time
    } else {
      timeTable.splice(i, 0, {start: '', time: '', title: ''})
      // timeTable.splice(i, 0, timeTable[i - 7])
    }
    if (i % 7 === 6) {
      week = []
      min = Math.min.apply(null, timeCount)
      timeCount = timeCount.map((value, index) => {
        value -= min
        if (over[index] === true) {
          week.push({start: '', title: ''})
          // week.push({start: timeTable[i - (6 - index) - 7].start, title: timeTable[i - (6 - index) - 7].title})
        } else {
          week.push({start: timeTable[i - (6 - index)].start, time: timeTable[i - (6 - index)].time, title: timeTable[i - (6 - index)].title})
        }
        over[index] = value === 0 ? false : true
        return value
      })
      sortTable.push(week)
    }
  }
  return sortByDay(sortTable, show)
}

const isDay = (show) => {
  const dayList = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  if (dayList.indexOf(show) >= 0) {
    return true
  } else {
    return false
  }
}

export function getProgramList (show) {
  return new Promise((resolve, reject) => {
    const _show = show || 'All'
    if (isDay(_show) === false) {
      reject('invalid argument')
    }
    request(URL, (error, response, body) => {
      if (error) {
        reject(error)
      }
      const $ = cheerio.load(body, {decodeEntities: false})
      let timeTable = []
      $('td').children('.title-p').each((i, elem) => {
        if (/^\n$/.test(elem.children[0].data) === true) {
          timeTable.push({start: '', time: '', title: elem.children[1].children[0].data.match(/[^\n]+/)[0]})
        } else {
          timeTable.push({start: '', time: '', title: elem.children[0].data.match(/[^\n]+/)[0]})
        }
      })
      $('td').children('.time').each((i, elem) => {
        timeTable[i].start = elem.children[0].data.match(/[0-9:]+/)[0]
      })
      $('td[class^=bg-]').each((i, elem) => {
        if (elem.attribs.rowspan % 10 === 9) {
          timeTable[i].time = (parseInt(elem.attribs.rowspan, 10) + 1).toString(10)
        } else {
          timeTable[i].time = elem.attribs.rowspan
        }
      })
      timeTable = sortTableByDay(timeTable, _show)
      resolve(timeTable)
    })
  })
}