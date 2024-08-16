import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

let TimeDiff = 0

export function setTimeDiff (val) {
    TimeDiff = val
}

// 解析时间戳内容 isPadzero 是否补0
export function parseMs (leftTime, isPadzero) {
    const days = Math.floor(leftTime / 86400000)
    const hours = Math.floor(leftTime / 3600000) % 24
    const minutes = Math.floor(leftTime / 60000) % 60
    const seconds = Math.floor(leftTime / 1000) % 60
    const milliseconds = Math.floor(leftTime) % 1000
    return {
        days,
        hours: isPadzero && hours <= 9 ? `0${hours}` : hours,
        minutes: isPadzero && minutes <= 9 ? `0${minutes}` : minutes,
        seconds: isPadzero && seconds <= 9 ? `0${seconds}` : seconds,
        milliseconds,
    }
}

// 将时间转为相对时间
export function formatRelativeDate (leftTime) {
    const { days, hours, minutes } = parseMs(leftTime, false)
    const { t } = useI18n({ useScope: 'global' })
    if (days >= 1) {
        return t('signal.common.dayAgo', [days])
    } else if (hours >= 1) {
        return t('signal.common.hourAgo', [hours])
    } else if (minutes >= 1) {
        return t('signal.common.minuteAgo', [minutes])
    } else {
        return t('signal.common.just')
    }
}

// 获取时间戳差
function getLeftTime (time) {
    const leftTime = (Date.now() + TimeDiff) - dayjs(time).valueOf()
    return leftTime
}

// 返回相对时间
export const getRelativeTime = (time) => {
    const leftTime = getLeftTime(time)
    return formatRelativeDate(leftTime)
}

// 是否过期时间【目前定12小时以上】
export const isExpiredTime = (time, expired = 12 * 3600 * 1000) => {
    const leftTime = getLeftTime(time)
    return leftTime > expired
}

// 获取当前时间戳
export function getTimestamp (isSecond = false) {
    // 当前毫秒时间戳
    const now = Date.now() + TimeDiff
    return isSecond ? Math.floor(now / 1000) : now
}

// 获取UTC时间
export function getUtcOffset () {
    const offset = dayjs().utcOffset() / 60
    return `UTC${offset > 0 ? '+' : ''}${offset}`
}
