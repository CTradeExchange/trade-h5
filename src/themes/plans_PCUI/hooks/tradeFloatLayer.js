import { localGetObj, localSetObj } from '@/utils/util'

// 设置快捷交易页板位置
export function setFloatPoint (module, pageElem) {
    if (pageElem) {
        const pageRect = pageElem.getBoundingClientRect()
        const floatElem = document.querySelector('.quickTransaction')
        const floatRect = floatElem.getBoundingClientRect()
        const point = localGetObj('tradeFloatLayer', module + 'Point')
        const initX = pageRect.right - floatRect.width
        const initY = pageRect.top + pageRect.height + window.scrollY
        const { x, y } = point ? formatPoint(point.x, point.y) : { x: initX, y: initY }

        return {
            x,
            y
        }
    } else {
        return {
            x: 0,
            y: 0
        }
    }
}

// 缓存交易页面的位置
export function localSetPoint (x, y, module) {
    localSetObj('tradeFloatLayer', module + 'Point', { x, y })
}

// 处理坐标不在可视区的情况
const formatPoint = (x, y) => {
    const clientWidth = document.body.clientWidth
    const clientHeight = document.body.clientHeight
    const floatElem = document.querySelector('.quickTransaction')
    const floatRect = floatElem.getBoundingClientRect()
    let pointX = x
    let pointY = y
    if (x >= clientWidth) {
        pointX = clientWidth - floatRect.width
    }
    if (y >= clientHeight) {
        pointY = clientHeight - floatRect.height
    }

    return {
        x: pointX,
        y: pointY
    }
}
