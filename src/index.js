import request from 'request'
import cheerio from 'cheerio'
const options = {
  url: 'http://www.agqr.jp/timetable/streaming.html',
  json: true
}

import fs from 'fs'
const out = fs.createWriteStream('console.log')
const logger = new console.Console(out)
const log = (value) => {
  logger.log(value)
}

const calcDay = (timeTable) => {
  // const response = {
  //   'Mon': [], 'Tue': [], 'Wed': [], 'Thu': [], 'Fri': [], 'Sat': [], 'Sun': []
  // }
  const response = []
  let week = []
  // let timeCount = {
  //   'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0
  // }
  let timeCount = [0, 0, 0, 0, 0, 0, 0]
  let over = [false, false, false, false, false, false, false]
  let min = 0
  let i = 0
  let tableIndex = 0
  // log(timeTable)
  while (1) {
    // log(i === tableIndex)
    if (over[i % 7] === false) {
      timeCount[i % 7] = timeTable[i].time
    } else {
      timeTable.splice(i, 0, {start: '', time: '', title: ''})
    }
    // log(timeCount)
    if (i % 7 === 6) {
      week = []
      min = Math.min.apply(null, timeCount)
      timeCount = timeCount.map((value, index) => {
        value -= min
        if (over[index] === true) {
          // week.push({time: ''})
          week.push({start: '', title: ''})
        } else {
          // week.push({time: min})
          week.push({start: timeTable[i - (6 - index)].start, title: timeTable[i - (6 - index)].title})
        }
        over[index] = value === 0 ? false : true
        return value
      })
      response.push(week)
    }
    i++
    if (i === timeTable.length) {
      break
    }
  }
  // log(timeTable)
  log(response)
  return timeTable
}

export function getList () {
  // console.log('agqr-list')
  request.get(options, (error, response, body) => {
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
      timeTable[i].time = elem.attribs.rowspan
    })
    // logger.log(timeTable)
    timeTable = calcDay(timeTable)
  })
  return 'agqr-list'
}