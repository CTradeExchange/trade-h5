import { localGet } from '@/utils/util'
import store from './store'

export const colors = {
    common: {
        primary: '#FD3250',
        primaryLight: '#FEF7F6',
        primaryBg: '#0062FF1A',
        riseColor: '#5FBA6E',
        fallColor: '#E32E49',
        warn: '#ef5353',
        success: '#26a69a',
        focusColor: '#f2a11b',
        btnTextDisabledColor: '#BDBDBD',
        fffColor: '#fff',
        fafColor: ' #FAF9F9'
    },
    night: {
        primaryAssistColor: '#2c2e3b',
        primaryLight: '#FEF7F6',
        color: '#eaebee',
        normalColor: '#9294a3',
        minorColor: '#9294a3',
        placeholdColor: '#515366',
        contentColor: '#21262f',
        bgColor: '#191e24',
        assistColor: '#2c2e3b',
        lineColor: '#2c2e3b',
        mainColor: '#ffffff'
    },
    light: {
        primaryAssistColor: '#f4f7fc',
        primaryLight: '#FEF7F6',
        color: '#333333',
        normalColor: '#656667',
        minorColor: '#9399A4',
        placeholdColor: '#c2c2c2',
        contentColor: '#ffffff',
        bgColor: '#f4f4f4',
        assistColor: '#F9F9FB',
        lineColor: '#F9F9FB',
        mainColor: '#000000'
    },
}

// 更新body类
function updateBodyClass (themeColor) {
    const classList = document.body.classList
    if (!themeColor || classList.contains(themeColor)) return false
    classList.remove('light')
    classList.remove('night')
    classList.add(themeColor)
}

// 设置root变量
export function setRootVariable (themeColor) {
    const invertColor = themeColor || localGet('invertColor')
    const chartColorType = JSON.parse(localGet('CHART_CONFIG'))?.chartColorType || 1
    const colorsArr = Object.assign(colors[invertColor], colors.common)
    updateBodyClass(invertColor)
    const { riseColor, fallColor } = colorsArr

    if (Number(chartColorType) === 1) {
        colorsArr.riseColor = riseColor
        colorsArr.fallColor = fallColor
    } else {
        colorsArr.riseColor = fallColor
        colorsArr.fallColor = riseColor
    }

    const style = document.body.style
    for (const key in colorsArr) {
        if (Object.hasOwnProperty.call(colorsArr, key)) {
            const el = colorsArr[key]
            style.setProperty(`--${key}`, el)
        }
    }
    store.commit('Update_style', colorsArr)
    sessionStorage.setItem('themeColors', JSON.stringify(colors))
}

export default colors
