import dayjs from '../../node_modules/dayjs'
import utc from '../../node_modules/dayjs/plugin/utc'
import isBetween from '../../node_modules/dayjs/plugin/isBetween'
import timezone from '../../node_modules/dayjs/plugin/timezone'
import duration from '../../node_modules/dayjs/plugin/duration'
dayjs.extend(utc)
dayjs.extend(isBetween)
dayjs.extend(timezone)
dayjs.extend(duration)
const dayjsEmulate = function (...args) {
    const utcOffset = parseFloat(sessionStorage.getItem('utcOffset')) || dayjs().utcOffset()
    return dayjs(...args).utcOffset(utcOffset)
}
dayjsEmulate.tz = dayjs.tz
dayjsEmulate.utc = dayjs.utc
dayjsEmulate.duration = dayjs.duration
window.dayjsEmulate = dayjsEmulate
// window.dayjs = dayjs
export default dayjsEmulate
