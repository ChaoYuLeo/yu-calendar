const getMonthInfo = function ({year, month}) {
  let jsMonth = month - 1
  let monthDayNum =  new Date(year, jsMonth + 1, 0).getDate()
  let dateFirstDay = new Date(year, jsMonth, 1).getDay()
  return {
    monthDayNum, // 当月天数
    dateFirstDay // 当月第一天是星期几
  }
}

const getNearMonth = function (year, month) {
  let jsMonth = month - 1
  let prevMonth = {}
  let crtMonth = {}
  let nextMonth = {}
  let prevDate = new Date(year, jsMonth - 1)
  let nextDate = new Date(year, jsMonth + 1)
  prevMonth.year = prevDate.getFullYear()
  prevMonth.month = prevDate.getMonth() + 1
  crtMonth.year = year
  crtMonth.month = month
  nextMonth.year = nextDate.getFullYear()
  nextMonth.month = nextDate.getMonth() + 1
  // console.log(prevMonth,crtMonth,nextMonth)
  return {
    prevMonth,
    crtMonth,
    nextMonth
  }
}

export const getRenderList = function (year, month) {
  let nearMonthObj = getNearMonth(year, month)
  let prevMonthInfo = getMonthInfo(nearMonthObj.prevMonth)
  let crtMonthInfo = getMonthInfo(nearMonthObj.crtMonth)
  let nextMonthInfo = getMonthInfo(nearMonthObj.nextMonth)

  let matchRowCount = 0
  let prevAddCrtCount = 0

  let prevList = []
  let crtList = []
  let nextList = []

  crtList = getArrayViaCount(crtMonthInfo.monthDayNum)

 /* console.log('上月天数:' + prevMonthInfo.monthDayNum)
  console.log('当月天数:' + crtMonthInfo.monthDayNum)
  console.log('下月天数:' + nextMonthInfo.monthDayNum)*/

  if (crtMonthInfo.dateFirstDay === 0) { // 当月第一天是星期天 
    matchRowCount = getMatchCount(crtMonthInfo.monthDayNum, 0)
    nextList = getArrayViaCount(matchRowCount - crtMonthInfo.monthDayNum)
  } else {
    prevList = getArrayViaCountEnd(prevMonthInfo.monthDayNum, crtMonthInfo.dateFirstDay)
    prevAddCrtCount = prevList.length + crtList.length
    matchRowCount = getMatchCount(crtMonthInfo.monthDayNum, prevList.length)
    if (prevAddCrtCount !== matchRowCount) {
      nextList = getArrayViaCount(matchRowCount - prevAddCrtCount)
    }
  }

  return {
    prevList,
    crtList,
    nextList
  }

}


const getArrayViaCount = function (count) {
  let ary = []
  for (let i = 0; i < count; i++) {
    ary[i] = i + 1
  }
  return ary
}

const getArrayViaCountEnd = function (count, num) {
  let start = count - num + 1
  let ary = []

  for (let i = 0; i < num; i++) {
    ary[i] = start + i
  }

  return ary
}

const getMatchCount = function (days, preDays) {
  let fourRowCount = 28
  let fiveRowCount = 35
  let sixRowCount = 42
  if (days + preDays <=28) {
    return fourRowCount
  } else if (days + preDays <= 35 && days + preDays > 28) {
    return fiveRowCount
  } else {
    return sixRowCount
  }
}

export const zero = function (num) {
  let str = ''
  if (num < 10) {
    str = '0' + num
  } else {
    str = '' + num
  }
  return str
}
