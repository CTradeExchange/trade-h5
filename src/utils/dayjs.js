import dayjs from '../../node_modules/dayjs'
import utc from '../../node_modules/dayjs/plugin/utc'
import isBetween from '../../node_modules/dayjs/plugin/isBetween'
import timezone from '../../node_modules/dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(isBetween)
dayjs.extend(timezone)
const dayjsEmulate = function (...args) {
    const utcOffset = parseFloat(sessionStorage.getItem('utcOffset')) || dayjs().utcOffset()
    return dayjs(...args).utcOffset(utcOffset)
}
dayjsEmulate.tz = dayjs.tz
dayjsEmulate.utc = dayjs.utc
window.dayjsEmulate = dayjsEmulate
window.dayjs = dayjsEmulate
window._dayjs = dayjs
export default dayjsEmulate
export const _dayjs = dayjs
