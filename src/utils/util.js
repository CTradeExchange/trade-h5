import pako from 'pako'

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
export function unzip(str){
    let strData = atob(str);
    let charData = strData.split('').map((t)=>(t.charCodeAt(0)));
    const binData = new Uint8Array(charData);
    const data = pako.inflate(binData);
    strData = String.fromCharCode.apply(null, new Uint16Array(data));
    strData = decodeURIComponent(strData)
    console.warn('解压字符',JSON.parse(strData));
    return strData;
}
// 获取设备类型
export function getDevice () {
    let openFrom = 'H5' // h5
    const checkUA = navigator.userAgent.match(/(\(.+?\))/)
    if(!checkUA){
        openFrom = 'H5'
    }else if (/iPhone/i.test(checkUA[0])) {
        openFrom = 'H5'
    }else if (/windows/i.test(checkUA[0])) {
        openFrom = 'PCUI_Windows'
    }else if (/Mac OS/i.test(checkUA[0])) {
        openFrom = 'PCUI_Mac'
    } else if (window.JsHook && window.JsHook.appGoDeposit) {
        openFrom = 'APP_Andorid' // 原生Android
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoDeposit) {
        openFrom = 'APP_IOS' // 原生IOS
    } else if (window.JsHook && JsHook.appOpenBrower) {
        openFrom = 'H5_Android' // 壳包Android
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appOpenBrower) {
        openFrom = 'H5_IOS' // 壳包IOS
    }
    return openFrom
}
