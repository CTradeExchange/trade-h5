import dayjs from '../../node_modules/dayjs'
import utc from '../../node_modules/dayjs/plugin/utc'
import isBetween from '../../node_modules/dayjs/plugin/isBetween'
import timezone from '../../node_modules/dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(isBetween)
dayjs.extend(timezone)
const dayjsEmulate = function (...args) {
    const utcOffset = sessionStorage.getItem('utcOffset') || dayjs().utcOffset()
    return dayjs(...args).utcOffset(parseFloat(utcOffset))
}
dayjsEmulate.tz = dayjs.tz
dayjsEmulate.utc = dayjs.utc
export default dayjsEmulate
