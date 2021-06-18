import dayjs from 'dayjs'

const todayStartTime = dayjs().startOf('day').valueOf()
const todayStartText = dayjs(todayStartTime).format('YYYY-MM-DD')
const todayEndTime = dayjs().endOf('day').valueOf()
const todayEndText = dayjs(todayEndTime).format('YYYY-MM-DD')
const prevWeek = dayjs().subtract(7, 'day').startOf('day').valueOf()
const prevWeekText = dayjs(prevWeek).format('YYYY-MM-DD')
const prevMonth = dayjs().subtract(1, 'month').startOf('day').valueOf()
const prevMonthText = dayjs(prevMonth).format('YYYY-MM-DD')
const threeMonth = dayjs().subtract(3, 'month').startOf('day').valueOf()
const threeMonthText = dayjs(threeMonth).format('YYYY-MM-DD')

export const timeActions = [
    { name: '今天', startTime: todayStartTime, endTime: todayEndTime, subname: `${todayStartText}` },
    { name: '上一周', startTime: prevWeek, endTime: todayEndTime, subname: `${prevWeekText} - ${todayEndText}` },
    { name: '上个月', startTime: prevMonth, endTime: todayEndTime, subname: `${prevMonthText} - ${todayEndText}` },
    { name: '最近三个月', startTime: threeMonth, endTime: todayEndTime, subname: `${threeMonthText} - ${todayEndText}` },
    { name: '自定义时间', },
]
