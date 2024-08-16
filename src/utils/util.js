import pako from 'pako'
import BigNumber from 'bignumber.js'
import CryptoJS from 'crypto-js'
import { toFixed, retainDecimal } from '@/utils/calculation.js'

// 判断当前环境是否在uniapp内运行
export const isUniapp = getQueryVariable('isUniapp') === 'true' || getQueryVariable('isApp') === '1' || navigator.userAgent.toLowerCase().includes('uni-app')
export const mobileReg = /^(13|14|15|16|17|18|19)\d{9}$/
export const emailReg = new RegExp(
    '^\\s*\\w+(?:\\.{0,1}[\\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\\.[a-zA-Z]+\\s*$'
)
export const bankNoReg = /^([1-9]{1})(\d{11}|\d{15}|\d{16}|\d{17}|\d{18})$/
// export const pwdReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,18}$/ // 至少8个字符，至少1个大写字母，至少1个字母，1个数字和1个特殊字符
// export const pwdReg =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,18}$/ // 至少8个字符，至少1个大写字母，至少1个字母，1个数字和1个特殊字符

export const pwdReg = /^[A-Za-z\d]{8,18}$/

export const randomId = () => {
    const r = Math.random() + Math.random() + Math.random()
    return r.toString().slice(2)
}

export function guid () {
    return (
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0
            const v = c == 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
        }) +
        '-' +
        Date.now()
    )
}

// Gzip解压 对应wp接口数据
window['unzip'] = unzip
export function unzip (str) {
    let strData = atob(str)
    const charData = strData.split('').map((t) => t.charCodeAt(0))
    const binData = new Uint8Array(charData)
    const data = pako.inflate(binData)
    strData = String.fromCharCode.apply(null, new Uint16Array(data))
    strData = decodeURIComponent(strData)
    return strData
}
window['zip'] = zip
// Gzip数据压缩
export function zip (str) {
    var binaryString = pako.gzip(encodeURIComponent(str), { to: 'string' })
    return btoa(binaryString)
}

// 获取设备类型
// export function getDevice () {
//     const checkUA = navigator.userAgent.match(/(\(.+?\))/)
//     let openFrom = 1 // h5
//     if (/windows|Macintosh/i.test(checkUA[0])) {
//         openFrom = 2 // PC
//     }
//     return openFrom
// }
// 获取设备类型
export function getDevice () {
    let openFrom = 2 // PC
    // if (/mobile|android|ios/i.test(navigator.userAgent)) {
    if (/mobile|android|ios|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        openFrom = 1 // h5
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
        if (pair[0] == variable) {
            return decodeURIComponent(pair[1])
        }
    }
    return undefined
}

// 获取登录参数
export function getLoginParams () {
    return JSON.parse(localStorage.getItem('loginParams'))
}
// 删除登录参数
export function removeLoginParams () {
    localStorage.removeItem('loginParams')
    localStorage.removeItem('token')
    removeDemoStr()
    delNewsToken()
}
// 清楚demo判定条件
export const removeDemoStr = () => {
    // 过期删除模拟账户信息
    if (isDemoAccount()) {
        localRemove('demo_domain')
        localRemove('companyType')
        sessionSet('companyId', localGet('companyId'))
        localRemove('companyId')
    }
}
// 设置登录token
export function setToken (token) {
    return localStorage.setItem('token', token)
}
export function delNewsToken () {
    store.commit('_user/Update_isNewsToKen', false)
    return localStorage.removeItem('newsToken')
}
// 获取登录token
export function getToken () {
    return localStorage.getItem('token')
}
export function localSet (key, val) {
    return localStorage.setItem(key, val)
}
export function localGet (key) {
    return localStorage.getItem(key)
}
/**
 * 解析JSON数据
 * @param {*} value -- 解析值
 */
export const parseJSON = (value) => {
    let result = null
    try {
        result = JSON.parse(value)
    } catch (error) {
        if (value) result = value
    }
    return result
}
// 设置本地存储json字符串数据
export function localSetJSON (key, val) {
    return localStorage.setItem(key, JSON.stringify(val))
}
// 获取本地存储json字符串类型
export function localGetJSON (key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key)
        return JSON.parse(value) || defaultValue
    } catch (e) {
        return defaultValue
    }
}
// 设置本地存储json字符串数据
export function sessionSetJSON (key, val) {
    return sessionStorage.setItem(key, JSON.stringify(val))
}
// 获取本地存储json字符串类型
export function sessionGetJSON (key, defaultValue = null) {
    try {
        const value = sessionStorage.getItem(key)
        return JSON.parse(value) || defaultValue
    } catch (e) {
        return defaultValue
    }
}
export function localRemove (key) {
    return localStorage.removeItem(key)
}
export function sessionSet (key, val) {
    return sessionStorage.setItem(key, val)
}
export function sessionGet (key) {
    return sessionStorage.getItem(key)
}
export function sessionRemove (key) {
    return sessionStorage.removeItem(key)
}

// localstorage 保存对象
export function localSetObj (objKey, key, val) {
    let localObj = localGet(objKey)
    if (!isEmpty(localObj)) {
        localObj = JSON.parse(localObj)
        localObj[key] = val
        localSet(objKey, JSON.stringify(localObj))
    } else {
        localSet(objKey, JSON.stringify({
            [key]: val
        }))
    }
}

// localStorage 根据 key 获取对象中的值
export function localGetObj (objKey, key) {
    const localObj = localGet(objKey)
    if (!isEmpty(localObj)) {
        return JSON.parse(localObj)[key]
    } else {
        return ''
    }
}

// localStorage 根据 key 删除对象的
export function localRemoveKey (objKey, key) {
    const localObj = localGet(objKey)
    if (!isEmpty(localObj)) {
        var temp = JSON.parse(localObj)
        delete temp[key]
        localSet(objKey, JSON.stringify(temp))
    }
}

// 格式化价格
export function priceFormat (price, digits) {
    const _price = price / Math.pow(10, digits)
    return _price.toFixed(digits)
}

export function digitsFormat (value, digits) {
    // 根据decimals保留小数位
    if (digits > 0 && value.includes('.')) {
        const [int, decimal] = value.split('.')
        return `${int}.${decimal.slice(0, digits)}`
    }
    return value
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
        return new Promise((resolve) => {
            awaitCount++
            setTimeout(resolve, 200)
        }).then(() => delayAwait(fn, false))
    })
}
/* 延迟一段时间 */
export function delayAwaitTime (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}
/* 获取字符长度 */
export const getLen = (str = '') =>
    str.length

/* 判断参数是否为空 */
export function isEmpty (obj) {
    try {
        if (obj == null || obj == undefined) {
            return true
        }
        // 判断数字是否是NaN
        if (typeof obj === 'number') {
            if (isNaN(obj)) {
                return true
            } else {
                return false
            }
        }
        // 判断参数是否是布尔、函数、日期、正则，是则返回false
        if (
            typeof obj === 'boolean' ||
            typeof obj === 'function' ||
            obj instanceof Date ||
            obj instanceof RegExp
        ) {
            return false
        }
        // 判断参数是否是字符串，去空，如果长度为0则返回true
        if (typeof obj === 'string') {
            if (obj.trim().length == 0) {
                return true
            } else {
                return false
            }
        }

        if (typeof obj === 'object') {
            // 判断参数是否是数组，数组为空则返回true
            if (obj instanceof Array) {
                if (obj.length == 0) {
                    return true
                } else {
                    return false
                }
            }

            // 判断参数是否是对象，判断是否是空对象，是则返回true
            if (obj instanceof Object) {
                // 判断对象属性个数
                if (Object.getOwnPropertyNames(obj).length == 0) {
                    return true
                } else {
                    return false
                }
            }
        }
    } catch (e) {
        return false
    }
}

/* 获取数组里面指定key = value的对象 */
export function getArrayObj (arr, key, value) {
    let temp = {}
    if (Array.isArray(arr)) {
        arr.forEach((item) => {
            if (String(item[key]) === String(value)) {
                temp = item
            }
        })
    }
    return temp
}

/* 对象排序 */
export function objArraySort (objArr, key) {
    const result = objArr.slice(0)
    return result.sort((a, b) => a[key] - b[key])
}

export function addThousandthSign (numStr, fixedNum, bool = false) {
    if (!numStr && typeof numStr !== 'number') return ''
    const newNumStr = String(numStr)
    const position = newNumStr.indexOf('.')
    let leftNumStr = newNumStr
    let rightNumStr = ''
    let rightNum = -1
    if (position > -1) {
        leftNumStr = newNumStr.substr(0, position)
        const tempRight = newNumStr.substring(position + 1)
        rightNumStr = `0.${tempRight}`
        rightNum = tempRight.length
    }
    const leftResult = leftNumStr.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')

    let rightResult = ''
    if (fixedNum || rightNum > -1) {
        if (bool) {
            rightResult = retainDecimal(rightNumStr || 0, fixedNum || rightNum)
        } else {
            rightResult = toFixed(rightNumStr || 0, fixedNum || rightNum)
        }
    }
    if (String(rightResult).indexOf('0.') > -1) {
        rightResult = rightResult.substring(1)
    }
    return leftResult + rightResult
}

/* 数组对象排序 */
export function arrayObjSort (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop]
        var val2 = obj2[prop]
        if (val1 < val2) {
            return -1
        } else if (val1 > val2) {
            return 1
        } else {
            return 0
        }
    }
}

/* 检测用户KYC状态 */
export function checkUserKYC ({ res, Dialog, router, store, t }) {
    // 登录KYC,0未认证跳,需转到认证页面,1待审核,2审核通过,3审核不通过
    // companyKycStatus 公司KYC开户状态，1开启 2未开启
    if (Number(res.data.companyKycStatus) === 1) {
        if (Number(res.data.kycAuditStatus === 0)) {
            Dialog.alert({
                title: t('common.tip'),
                confirmButtonText: t('login.goAuthenticate'),
                message: t('login.goAuthenticateMsg'),
            })
                .then(() => {
                    return router.push('/home')
                })
                .then(() => {
                    router.push('/home/authentication')
                })
        } else if (Number(res.data.kycAuditStatus === 1)) {
            Dialog.alert({
                title: t('common.tip'),
                confirmButtonText: t('common.close'),
                message: t('common.inReview'),
            }).then(() => {
                store
                    .dispatch('_user/logout')
                    .then(() => {
                        return router.push('/login')
                    })
                    .then(() => {
                        location.reload()
                    })
            })
        } else if (Number(res.data.kycAuditStatus === 3)) {
            Dialog.alert({
                title: t('common.tip'),
                confirmButtonText: t('common.reSubmit'),
                message: t('common.reviewFailed'),
            })
                .then(() => {
                    return router.push('/home')
                })
                .then(() => {
                    router.push('/home/authentication')
                })
        }
    }
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export function debounce (func, wait = 200, immediate = false) {
    let timer
    return function (...rest) {
        if (timer) clearTimeout(timer)
        if (immediate) {
            const callNow = !timer
            timer = setTimeout(() => {
                timer = null
            }, wait)
            if (callNow) func.apply(this, rest)
        } else {
            timer = setTimeout(() => {
                func.apply(this, rest)
            }, wait)
        }
    }
}

// 返回指定值之间的随机数。不小于 min（有可能等于），并且小于（不等于）max。
export function getRandom (min, max) {
    if (typeof min === 'undefined' || typeof min === 'undefined') { return Math.random() }
    return Math.random() * (max - min) + min
}

/*
设置cookie
time 参数
s是指秒 s20代表20秒
h是指小时，如12小时则是：h12
d是天数，30天则：d30
y是年 1年则是 1y
*/
export function setCookie (name, value, time) {
    var strsec = getsec(time)
    var exp = new Date()
    exp.setTime(exp.getTime() + strsec * 1)
    document.cookie =
        name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/'
}

// 读取cookie
export function getCookie (cookName) {
    var cookieStr = document.cookie.split(';')
    for (var i = 0; i < cookieStr.length; i++) {
        var val = cookieStr[i].split('=')

        if (val.length && escape(cookName) === val[0].trim()) {
            return unescape(val[1])
        }
    }
    return null
}

function getsec (str) {
    var str1 = str.substring(1, str.length) * 1
    var str2 = str.substring(0, 1)
    if (str2 === 's') {
        return str1 * 1000
    } else if (str2 === 'h') {
        return str1 * 60 * 60 * 1000
    } else if (str2 === 'd') {
        return str1 * 24 * 60 * 60 * 1000
    } else if (str2 === 'y') {
        return str1 * 365 * 24 * 60 * 60 * 1000
    }
}

/* 隐藏邮箱 */
export function hideEmailInfo (email) {
    if (!email) return ''
    var reg = /(.{2}).+(.{2}@.+)/g
    if (email?.indexOf('**@') > 0) {
        return email
    }
    return email.replace(reg, '$1**$2')
}

/* 隐藏 */
export function hideMobileInfo (mobile) {
    let newMobile = ''
    if (mobile.length > 5) {
        newMobile = mobile.substr(0, 2) + '****' + mobile.substr(mobile.length - 2)
        return newMobile
    } else {
        return mobile
    }
}

function isElement (node) {
    const ELEMENT_NODE_TYPE = 1
    return (
        node.tagName !== 'HTML' &&
        node.tagName !== 'BODY' &&
        node.nodeType === ELEMENT_NODE_TYPE
    )
}
// 获取父层的滚动DOM
export function getScrollParent (el, root) {
    let node = el
    const overflowScrollReg = /scroll|auto/i
    while (node && node !== root && isElement(node)) {
        const { overflowY } = window.getComputedStyle(node)
        if (overflowScrollReg.test(overflowY)) {
            return node
        }
        node = node.parentNode
    }

    return root
}

// 排序
export function compare (property) {
    return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
    }
}

// 处理公告里面的时间标签
export function computeHtmlTime (content) {
    try {
        const reg = /<?time[^>]*>[^<]*<\/time>/gi
        const tag = content.match(reg)
        let returnVal
        if (!isEmpty(tag) && tag.length > 0) {
            tag.forEach((item) => {
                returnVal = content.replace(reg, function (matchStr) {
                    const time = matchStr.toString().replace(/<\/?time>/g, '')
                    return window.dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss')
                })
            })
            return returnVal
        } else {
            return content
        }
    } catch (error) {
        console.log(error)
    }
}

/* 隐藏地址中间部分 */
export function hideWalletMiddleInfo (address, insignia = '****') {
    if (!address) return ''
    var reg = /(.{4}).+(.{3}.+)/g
    return address.replace(reg, `$1${insignia}$2`)
}

/**
 * @desc 获取url参数
 * @param {String} name  想要获取的参数名字
 */
export function getQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
}

/* 获取默认区号索引 */
export function getDefaultZoneIndex (countryList, defaultZone) {
    let index = -1
    if (!Array.isArray(countryList) || countryList.length === 0) return index
    const language = navigator.language // 当前系统语言
    // 根据语言优先显示默认区号
    if (index === -1 && language) {
        let langCode = language.substring(
            language.lastIndexOf('-') + 1,
            language.length
        )
        langCode = langCode.toUpperCase()
        switch (langCode) {
        case 'JA':
            langCode = 'JP'
            break
        case 'EN':
            langCode = 'US'
            break
        case 'VI':
            langCode = 'VN'
            break
        case 'MS':
            langCode = 'MY'
            break
        case 'KO':
            langCode = 'KR'
            break
        case 'DA':
            langCode = 'DK'
            break
        }
        index = countryList.findIndex((el) => el.nationalCode === langCode)
    }
    if (index === -1 && defaultZone) {
        index = countryList.findIndex((el) => el.code === defaultZone)
    }
    return index
}

// 判断字符串是否为 json格式
export function isJSON (str) {
    if (typeof str === 'string') {
        try {
            var obj = JSON.parse(str)
            if (typeof obj === 'object' && obj) {
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }
}

// 新开发UI开关
export const NEWUI_SHOW = true
// 交易账户状态
export const COMPANY_TYPE = 'demo'

// 判断是否模拟账户
export function isDemoAccount () {
    const companyType = localGet('companyType') === COMPANY_TYPE
    const demoDomain = !!localGet('demo_domain')
    const companyId = !!localGet('companyId') && !!sessionGet('companyId')
    const cIdFlag = localGet('companyId') !== sessionGet('companyId')
    return companyType && demoDomain && companyId && cIdFlag && NEWUI_SHOW
}

// 更换demo账户域名
export const replaceDemoBaseUrl = (baseUrl, key) => {
    const url = window[`${key}Demo`]
    if (isDemoAccount() && url && url.indexOf('://') >= 0) {
        const host = url.split('://').reverse()[0].split('/')[0]
        const origin = url.split('://')[0] + '://' + host
        if (baseUrl.indexOf('://') >= 0) {
            let append = baseUrl.split('://')[1].split('/').filter(i => i)
            append = append.map((i, k) => k === 0 ? origin : i).join('/')
            return append
        }
        return origin + baseUrl
    }
    return baseUrl
}
// 更换demo账户域名
export const replaceBaseUrl = (baseUrl, key) => {
    const realUrl = window[key]
    const demoUrl = window[`${key}Demo`]
    if (isDemoAccount() && demoUrl && process.env.NODE_ENV === 'production') {
        const resultUrl = realUrl ? baseUrl.replace(realUrl, demoUrl) : demoUrl + baseUrl
        return resultUrl
    }
    return baseUrl
}

export function isChina () {
    const lang = localGet('lang')
    return lang && lang.indexOf('zh') > -1
}

// 产品排序
const currencys = ['V10', 'BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'LUNA', 'DOT', 'AVAX', 'DOGE', 'MATIC', 'SHIB', 'LINK', 'NEAR', 'UNI', 'ALGO', 'LTC', 'ATOM', 'ICP', 'BCH', 'TRX', 'XLM', 'FTM', 'FTT', 'MANA', 'HBAR', 'VET', 'AXS', 'FIL', 'SAND']
export function productSort (data) {
    let result = []
    currencys.map(currency => {
        data.map(elem => {
            if (elem.baseCurrency === currency) {
                result.push(elem)
                data = data.filter(el => el.symbolId !== elem.symbolId)
            }
        })
    })
    result = result.concat(data)
    return result
}

/**
 * 文本复制
 * @param {string} val
 */
export const copyText = (val) => {
    var input = document.createElement('textarea')
    input.value = val
    document.body.appendChild(input)
    input.select()
    input.setSelectionRange(0, input.value.length), document.execCommand('Copy')
    document.body.removeChild(input)
}

export function getProductList (trades) {
    if (isEmpty(trades)) return []

    let userProductCategory = store.getters['_quote/userProductCategory']
    if (userProductCategory && Object.keys(userProductCategory).length === 0) {
        userProductCategory = localGet('userProductCategoryCache')
    }

    if (userProductCategory && Object.keys(userProductCategory).length === 0) return []

    let productMap = store.state._quote.productMap
    if (productMap && Object.keys(productMap).length === 0) {
        productMap = localGet('productMapCache')
    }
    if (productMap && Object.keys(productMap).length === 0) return []
    const tradeType = 2
    const categoryList = (userProductCategory[tradeType] || []).filter(e => e.listByUser.length)
    // 所有产品数组
    let AllList = []
    if (categoryList.length > 0) {
        categoryList.forEach(item => {
            const { listByUser } = item || {}
            if (listByUser && listByUser.length > 0) {
                AllList = AllList.concat(listByUser)
            }
        })
    }

    const curTradeList = []
    for (var i = 0; i < trades.length; i++) {
        const { Extra } = trades[i] || {}
        if (!isEmpty(Extra)) {
            try {
                const SymbolObj = JSON.parse(Extra)
                const { SymbolId } = SymbolObj || {}
                if (AllList.indexOf(SymbolId) > -1) {
                    curTradeList.push(SymbolId)
                }
            } catch (e) {}
        }
    }
    const productList = []
    curTradeList.forEach(symbolId => {
        const product = productMap[`${symbolId}_${tradeType}`]
        if (product) {
            productList.push(product)
        }
    })
    // 产品排序
    return productSort(productList)
}

// 获取比赛页相关产品
export function getCompetitionProductList (SymbolIDs) {
    if (isEmpty(SymbolIDs)) return []
    let productMap = store.state._quote.productMap
    if (productMap && Object.keys(productMap).length === 0) {
	    productMap = localGet('productMapCache')
    }
    if (productMap && Object.keys(productMap).length === 0) return []
    const tradeType = 2
    const productList = []
    const tradeList = SymbolIDs.split(',')
    tradeList.forEach(symbolId => {
	    const product = productMap[`${symbolId}_${tradeType}`]
        if (product) {
            productList.push(product)
        }
    })

    // 产品排序
    return productSort(productList)
}

export const isInt = (n) => {
    return parseInt(n) === parseFloat(n)
}

export const fixedNumber = (val, scale, unit, defaultValue = '--') => {
    if (!val) {
        return defaultValue
    }
    if (scale) {
        return `${val}${scale.trim()}`
    }
    if (!Number.isFinite(Number(val))) {
        return val
    }
    let res = ''
    const number = Math.abs(Number(val))
    const symbol = number >= 0 ? '' : '-'
    let afterSymbol = ''
    if (number >= Math.pow(10, 12)) {
        const temp = BigNumber(number).div(BigNumber(Math.pow(10, 12)))
        afterSymbol = 'T'
        res = `${temp.toFixed(2).toString()}`
    } else if (number >= Math.pow(10, 9)) {
        const temp = BigNumber(number).div(BigNumber(Math.pow(10, 9)))
        afterSymbol = 'B'
        res = `${temp.toFixed(2).toString()}`
    } else if (number >= Math.pow(10, 6)) {
        const temp = BigNumber(number).div(BigNumber(Math.pow(10, 6)))
        afterSymbol = 'M'
        res = `${temp.toFixed(2).toString()}`
    } else if (number >= Math.pow(10, 3)) {
        const temp = BigNumber(number).div(BigNumber(Math.pow(10, 3)))
        afterSymbol = 'K'
        res = `${temp.toFixed(2).toString()}`
    } else if (number >= Math.pow(10, 0)) {
        const temp = BigNumber(number).div(BigNumber(Math.pow(10, 0)))
        afterSymbol = ''
        res = `${temp.toFixed(2).toString()}`
    } else {
        afterSymbol = ''
        res = number === 0 ? '0' : number.toFixed(4)
    }
    if (unit === '%') {
        return `${symbol}${parseFloat(res)}${afterSymbol}%`
    }
    return `${symbol}${parseFloat(res)}${afterSymbol}`
}
export const AES_KEY = '0NWV1zYcHlAzghGX'

// msg 需要被对称加密的明文
// key aes 对称加密的密钥  必须是16长度,为了和后端交互 key字符串必须是16进制字符串,否在给golang进行string -> []byte带来困难
export function encrypt_with_aes (msg, key = AES_KEY) {
    if (!msg) {
        return msg
    }
    key = CryptoJS.enc.Utf8.parse(key)
    // 加密结果返回的是CipherParams object类型
    // key 和 iv 使用同一个值
    var encrypted = CryptoJS.AES.encrypt(msg, key, {
        iv: key,
        mode: CryptoJS.mode.CBC, // CBC算法
        padding: CryptoJS.pad.Pkcs7, // 使用pkcs7 进行padding 后端需要注意
    })
    // ciphertext是密文，toString()内传编码格式，比如Base64，这里用了16进制
    // 如果密文要放在 url的参数中 建议进行 base64-url-encoding 和 hex encoding, 不建议使用base64 encoding
    // return encrypted.toString()  //后端必须进行相反操作
    const hexStr = encrypted.ciphertext.toString(CryptoJS.enc.Hex)
    var oldHexStr = CryptoJS.enc.Hex.parse(hexStr)
    // 将密文转为Base64的字符串
    var base64Str = CryptoJS.enc.Base64.stringify(oldHexStr)
    return base64Str
};

export function decrypt_with_aes (msg, key = AES_KEY) {
    if (!msg) {
        return msg
    }
    key = CryptoJS.enc.Utf8.parse(key)
    // 加密结果返回的是CipherParams object类型
    // key 和 iv 使用同一个值
    var decrypted = CryptoJS.AES.decrypt(msg, key, {
        iv: key,
        mode: CryptoJS.mode.CBC, // CBC算法
        padding: CryptoJS.pad.Pkcs7, // 使用pkcs7 进行padding 后端需要注意
    })
    // ciphertext是密文，toString()内传编码格式，比如Base64，这里用了16进制
    // 如果密文要放在 url的参数中 建议进行 base64-url-encoding 和 hex encoding, 不建议使用base64 encoding
    return decrypted.toString(CryptoJS.enc.Utf8)
};
// 增加语言的时候，需要在这里增加相同语言缩写
export const langList = ['th-TH', 'en-US', 'zh-CN', 'zh-HK', 'fr-FR', 'es-ES', 'tr-TR', 'ko-KR']

export const DERAULT_LANG = 'en-US'

// 判断mobile
export const isMobile = () => {
    return getDevice() === 1
    // const flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    // return flag
}

// 获取路径上的参数
export const getPathParams = (key) => {
    const result = {}
    const search = location.search.split('?').filter(i => i).join('?')
    const arr = search.split('&').filter(i => i && i.indexOf('=') > 0)
    arr.forEach(i => result[i.split('=')[0]] = i.split('=')[1])
    return key ? result[key] : result
}

export const postInviteQuery = () => {
    const query = getPathParams() || {}
    var url = window.location.href // 获取当前页面的url
    if (url.indexOf('?') !== -1 && query.cg_id) { // 判断是否存在参数
        url = url.replace(/(\?|#)[^'"]*/, '') // 去除参数
        window.history.pushState({}, 0, url)
        localSet('inviteQuery', query)
    }
}

export const getInviteQuery = () => {
    const data = localGet('inviteQuery')
    if (data && typeof data === 'object') {
        localRemove('inviteQuery')
        return data
    }
    return {}
}

// 是否为初级用户组
export function isRegularAccount () {
    let isRegularAccount = false
    const customerInfo = store.state._user.customerInfo
    const { customerGroupId } = customerInfo || {}

    const { newsSysConfig } = store.state._news
    const userGroup = newsSysConfig && newsSysConfig.find((o) => o.Key === 'regularIDs')
    const { Value } = userGroup || {}
    if (!isEmpty(Value)) {
        const groupIDs = JSON.parse(Value)
        if (customerGroupId && groupIDs.includes(customerGroupId)) {
		    isRegularAccount = true
        }
    }
    return isRegularAccount
}

export const handleEventSkip = (route) => {
    const reg = new RegExp('/(' + langList.join('|') + ')/')
    const path = location.pathname.replace(reg, '')
    const flag = path.split('/').filter(i => i).length === 1
    const flags = route.every(i => {
        let child = true
        if (i.path === '/') {
            child = i.children.every(j => (j.path.indexOf(path) === -1 && (j.redirect ?? '').indexOf(path) === -1))
        } else if (i.path == '/:pathMatch(.*)*') {
            return true
        }
        return i.path.indexOf(path) !== 1 && (i.redirect ?? '').indexOf(path) === -1 && child
    })
    if (flag && flags) {
        location.replace(`${location.origin}/en-US/event/${path}`)
    }
}

// 判断移动端环境
export const getIosOrAndroid = () => {
    const userAgent = window.navigator.userAgent
    const env = userAgent.indexOf('iPhone') > -1 ? 'ios' : 'android'
    return { env }
}

/**
 * 打开APP
 */
export const openUrlSchemes = () => {
    const APPURL = 'mc900://'
    const { env } = getIosOrAndroid()
    if (env === 'ios') {
        window.location.href = APPURL
    } else {
        let iFrame = document.createElement('iframe')
        iFrame.setAttribute('src', APPURL)
        iFrame.setAttribute('style', 'display:none;')
        iFrame.setAttribute('width', '0px')
        iFrame.setAttribute('height', '0px')
        iFrame.setAttribute('frameborder', '0px')
        document.body.appendChild(iFrame)
        iFrame.parentNode.removeChild(iFrame)
        iFrame = null
    }
}

// 判断存款来源
export const getDepositFrom = () => {
    const h5Flag = getDevice() === 1
    if (h5Flag) {
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            return 'H5_IOS'
        } else {
            return 'H5_Android'
        }
    } else {
        if (/macintosh|mac os x/i.test(navigator.userAgent)) {
            return 'PCUI_Mac'
        } else {
            return 'PCUI_Windows'
        }
    }
}

// 省略号转换
export function formatEllipsis (value, num = 6) {
    if (!value) return ''
    const start = value.substring(0, num)
    const end = value.substring(value.length - num)
    return start + '...' + end
}

// 隐藏数字
export function formatHideNum (num = 8) {
    let result = ''
    for (let i = 1; i <= num; i++) {
        result += '*'
    }
    return result
}

// 禁止鼠标滚轮事件
export function stopScrollFun (evt) {
    evt = evt || window.event
    if (evt.preventDefault) {
        // Firefox
        evt.preventDefault()
        evt.stopPropagation()
    } else {
        // IE
        evt.cancelBubble = true
        evt.returnValue = false
    }
    return false
}

// 检查是否以太坊地址
export function checkAddressResult (address, chainName) {
    if (!address) {
        return false
    }
    const ethereumAddressRegex = /^0x[0-9a-fA-F]{40}$/
    const trxAddressRegex = /^T[1-9A-HJ-NP-Za-km-z]{33}$/
    let RegExp
    if (chainName.toUpperCase().indexOf('TRON') > -1) {
        RegExp = trxAddressRegex
    } else {
        RegExp = ethereumAddressRegex
    }
    if (RegExp.test(address)) {
        return true
    } else {
        return false
    }
}
