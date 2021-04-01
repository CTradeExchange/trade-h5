import pako from 'pako'

export const mobileReg = /^(13|14|15|16|17|18|19)\d{9}$/
export const emailReg = new RegExp('^\\s*\\w+(?:\\.{0,1}[\\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\\.[a-zA-Z]+\\s*$')

export const randomId = () => {
    const r = Math.random() + Math.random() + Math.random()
    return r.toString().slice(2)
}

export function guid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0
        const v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    }) + '-' + Date.now()
}

// Gzip解压 对应wp接口数据
export function unzip (str) {
    let strData = atob(str)
    const charData = strData.split('').map((t) => (t.charCodeAt(0)))
    const binData = new Uint8Array(charData)
    const data = pako.inflate(binData)
    strData = String.fromCharCode.apply(null, new Uint16Array(data))
    strData = decodeURIComponent(strData)
    console.warn('解压字符', JSON.parse(strData))
    return strData
}
// 获取设备类型
export function getDevice () {
    let openFrom = 1 // h5
    const checkUA = navigator.userAgent.match(/(\(.+?\))/)
    if (!checkUA) {
        openFrom = 1 // H5
    } else if (/iPhone/i.test(checkUA[0])) {
        openFrom = 1 // H5
    } else if (/windows/i.test(checkUA[0])) {
        openFrom = 4 // PCUI_Windows
    } else if (/Mac OS/i.test(checkUA[0])) {
        openFrom = 5 // PCUI_Mac
    } else if (window.JsHook && window.JsHook.appGoDeposit) {
        openFrom = 6 // APP_Andorid
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoDeposit) {
        openFrom = 7 // APP_IOS
    } else if (window.JsHook && JsHook.appOpenBrower) {
        openFrom = 2 // H5_Android
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appOpenBrower) {
        openFrom = 3 // H5_IOS
    }
    return openFrom
}

// 获取连接参数
export function getQueryVariable (variable, search = location.search) {
    if (!search) {
        return undefined
    }
    var query = search.substring(1)
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == variable) { return decodeURIComponent(pair[1]) }
    }
    return undefined
}

// 获取登录参数
export function getLoginParams () {
    return JSON.parse(localStorage.getItem('loginParams'))
}
// 设置登录token
export function setToken (token) {
    return sessionStorage.setItem('token', token)
}
// 获取登录token
export function getToken () {
    return sessionStorage.getItem('token')
}
// 格式化价格
export function priceFormat (price, digits) {
    const _price = price / Math.pow(10, digits)
    return _price.toFixed(digits)
}

/* 延迟处理 */
let awaitCount = 0
export function delayAwait (fn, reset = true) {
    if (reset) awaitCount = 0
    return new Promise((resolve, reject) => {
        console.log(`>> Await count:: ${awaitCount * 200}ms`)
        const flag = fn()
        if (flag) {
            return resolve(flag)
        } else {
            return awaitCount < 100 ? reject() : resolve()
        }
    }).catch(() => {
        return new Promise(resolve => {
            awaitCount++
            setTimeout(resolve, 200)
        }).then(() => delayAwait(fn, false))
    })
}
/* 获取字符长度 */
export const getLen = (str = '') => str.replace(/\p{Unified_Ideograph}/ug, '01').length
