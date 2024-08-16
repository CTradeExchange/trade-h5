import { localGet, getQueryString } from '@/utils/util'
import store from './store'
const colors = {
    common: {
        primary: '#FD3250',
        warn: '#B72122',
        primaryLight: '#FEF7F6',
        success: '#26a69a',
        quoteRiseBg: '#f8e8e8',
        quoteFallBg: '#e9f0f7',
        focusColor: '#f2a11b',
        noticeColor: '#F8F8F8',
        noticeTextColor: '#5B5B5C',
        newPrimary: '#BE1E2D',
        primaryOpacity: '#FFC9CE',
        assetsColor: '#0C0C0C',
        allColor: '#4069F2',
        transferSuccessBg: '#FAF9F9',
        tipsTextColor: '#666666',
        disabledBgColor: '#f9f8f8',
        btnDisabledColor: '#F7F7F7',
        btnTextDisabledColor: '#BDBDBD',
        fffColor: '#fff',
        fafColor: ' #FAF9F9'
    },
    night: {
        riseColor: '#5FBA6E',
        fallColor: '#E32E49',
        primaryAssistColor: '#2c2e3b',
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
        riseColor: '#5FBA6E',
        fallColor: '#E32E49',
        primaryAssistColor: '#f4f7fc',
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
export function setRootVariable (themeColor, primaryColor) {
    const invertColor = getQueryString('theme') || themeColor || localGet('invertColor')
    const chartColorType = getQueryString('chartColorType') || JSON.parse(localGet('CHART_CONFIG'))?.chartColorType || 1
    // if (primaryColor) {
    //     colors.common.primary = primaryColor
    //     colors.common.primaryBg = primaryColor + '1A'
    // }

    const colorsArr = Object.assign({}, colors.common, colors[invertColor])
    updateBodyClass(invertColor)
    const { riseColor, fallColor, quoteRiseBg, quoteFallBg } = colorsArr

    if (Number(chartColorType) === 1) {
        colorsArr.riseColor = riseColor
        colorsArr.fallColor = fallColor
        colorsArr.quoteRiseBg = quoteRiseBg
        colorsArr.quoteFallBg = quoteFallBg
    } else {
        colorsArr.riseColor = fallColor
        colorsArr.fallColor = riseColor
        colorsArr.quoteRiseBg = quoteFallBg
        colorsArr.quoteFallBg = quoteRiseBg
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
