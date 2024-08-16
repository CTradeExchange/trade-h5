import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'
import { deleteToken, getMessaging, getToken, onMessage } from 'firebase/messaging'
import { getCookie, isDemoAccount, isEmpty, isMobile, localGet, localRemove, localSet, parseJSON } from './util'
import { ReportDevice, ReportEvent, UpdateUserInfo } from '@/api/newApi'
import { findPhoneAndEmail } from '@/api/user'
import { ElNotification } from 'element-plus'
import { Notify } from 'vant'
import md5 from 'js-md5'
import dayjs from 'dayjs'

const vapid_key = 'BFuqD1LU6vYlKsLm4VGHW4L441xRGx_xFIhASaBZLWOTOuEgi8PZAi1u4tvIEF-RIDf8-zV58Eo17Qs04UPqjQ0'
const default_title = 'Headline.net'

const initFirebase = () => {
    if (global.appConfig) {
        return Promise.resolve(global.appConfig)
    }
    const firebaseConfig = {
        apiKey: 'AIzaSyBEBk5vgB2rdYlD003IdDkYdm9sEXx6VOo',
        authDomain: 'headline-app-a3988.firebaseapp.com',
        projectId: 'headline-app-a3988',
        storageBucket: 'headline-app-a3988.appspot.com',
        messagingSenderId: '357833684311',
        appId: '1:357833684311:web:dbc566f8fcd3b1eb8a3a12',
        measurementId: 'G-YPLGMSBT0D'
    }
    const appConfig = initializeApp(firebaseConfig, 'Headline.net')
    global.appConfig = appConfig
    return Promise.resolve(appConfig)
}

// 网页前台接收消息
export const firebaseMessage = async () => {
    if (!('serviceWorker' in navigator)) return
    const appConfig = await initFirebase()
    const messaging = getMessaging(appConfig)
    onMessage(messaging, (payload) => {
        const { notification } = payload || {}
        const { title, body } = notification || {}
        if (isMobile()) {
            Notify({
                message: body || '通知',
                duration: 5000,
            })
        } else {
            ElNotification({
                title: title || default_title,
                message: body || '通知',
                class: 'paymentSuccessClass',
                duration: 3000,
            })
        }
    })
}

// 获取注册令牌并传入服务器--登录时候调用 common 为TRUE 公共，允许用户为空
export const pushUserToken = async (common) => {
    try {
        if (!('Notification' in window)) {
            throw 'This browser does not support message push'
        }
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
            throw 'The user explicitly denied the permission request.'
        }
        const { customerInfo } = store.state?._user || {}
        if (!customerInfo?.customerNo && !common) {
            throw 'The user not logged in.'
        }
        const tokenTime = Date.now()
        await isSupported() // 检测API
        const appConfig = await initFirebase()
        window?.printLog(appConfig, 'appConfig')
        const messaging = getMessaging(appConfig)
        window?.printLog(messaging, 'messaging')
        // 启用消息导出
        // experimentalSetDeliveryMetricsExportedToBigQuery(messaging, userConsent);
        // await deleteToken(messaging) // 删除实例关联的令牌
        const currentToken = await getToken(messaging, { vapidKey: vapid_key })
        window?.printLog(currentToken, 'currentToken')
        if (!currentToken) {
            throw 'Registration token generation failed'
        }
        const Data = {
            Channel: 'fcmWeb',
            DeviceToken: currentToken,
            Language: getCookie('lang'),
        }
        if (customerInfo?.customerNo) {
            Data.CustomerNo = customerInfo?.customerNo
        }
        if (localGet('fcmWeb') === JSON.stringify(Data)) {
            throw 'The same value already exists locally'
        }
        const { DeviceToken: dt } = parseJSON(localGet('fcmWeb')) || {}
        localSet('fcmWeb', JSON.stringify(Data))
        const Extra = {
            tokenTime,
            userAgent: window.navigator.userAgent,
        }
        if (dt && dt !== currentToken) {
            Extra.oldDeviceToken = dt
        }
        ReportDevice({
            body: {
                Data: {
                    ...Data,
                    Extra: JSON.stringify(Extra)
                }
            }
        })
        if (customerInfo?.customerNo && !common) {
            UpdateUserInfo({
                body: {
                    FcmWebToken: currentToken,
                    FcmWebDeviceLanguage: getCookie('lang')
                }
            })
        }
    } catch (error) {
        console.log('waring:', error)
    }
}

const handleParams = (params) => {
    const { key, value } = params
    let result = {}
    try {
        const obj = JSON.parse(value)
        Object.keys(obj).forEach(i => {
            if (obj[i] || typeof obj[i] === 'number') {
                result[i] = obj[i]
            }
        })
    } catch {
        result = { [key]: value }
    }
    return result
}

// 数据埋点
export const firebaseAnalytics = async (event, params, appendInfo) => {
    window?.printLog(event, Date.now(), JSON.stringify(params), JSON.stringify(appendInfo))
    if (process.env.NODE_ENV !== 'production' || !event) return
    const newsSysConfig = store.state?._base?.newsSysConfig || []
    const content = newsSysConfig.find(i => i.Key === 'firebaseEventWebBL') || {}
    const blacklist = parseJSON(content.Value) || []
    if (blacklist.includes(event)) return // 黑名单处理
    let resultParams = !isEmpty(params) ? handleParams(params) : {}
    const { customerInfo } = store.state._user || {}
    const { wpCompanyInfo } = store.state._base || {}
    if (wpCompanyInfo) {
        const { companyId, customerGroupId } = wpCompanyInfo || {}
        resultParams = { ...resultParams, companyId, customerGroupId }
    }
    if (customerInfo) {
        const {
            companyId,
            customerNo: userId,
            customerGroupId,
            email,
            phone,
            emailAll,
            phoneAll,
        } = customerInfo || {}
        resultParams = {
            ...resultParams,
            userId,
            isDemoTrading: isDemoAccount(),
        }
        if (!resultParams.companyId) resultParams.companyId = companyId
        if (!resultParams.customerGroupId) resultParams.customerGroupId = customerGroupId
        const resultEmail = emailAll || (email?.indexOf('*') > -1 ? '' : email)
        const resultPhone = phoneAll || (phone?.indexOf('*') > -1 ? '' : phone)
        if (resultEmail) resultParams.email = resultEmail
        if (resultPhone) resultParams.phone = resultPhone
        // if (!resultParams.email && !resultParams.phone) {
        //     const result = await findPhoneAndEmail()
        //     if (result.data?.email) resultParams.email = result.data?.email
        //     if (result.data?.phone) resultParams.phone = result.data?.phone
        // }
    }

    if (appendInfo) {
        const {
            companyId,
            customerNo: userId,
            customerGroupId,
            auditType, // 人工审核
            email,
            phone,
        } = appendInfo || {}
        if (userId) resultParams.userId = userId
        if (companyId) resultParams.companyId = companyId
        if (auditType) resultParams.auditType = auditType
        if (customerGroupId) resultParams.customerGroupId = customerGroupId
        if (email && email?.indexOf('*') === -1) resultParams.email = email
        if (phone && phone?.indexOf('*') === -1) resultParams.phone = phone
    }
    resultParams.platform_source = isMobile() ? 'Web_Mobile' : 'Web_PC'
    const flag = verification(event)
    if (flag) {
        resultParams = {
            ...resultParams,
            pathname: window?.location.href ?? '',
            userAgent: window?.navigator?.userAgent ?? '',
        }
        const Data = {
            EventName: event,
            Platform: resultParams.platform_source,
            CommonParam: JSON.stringify(resultParams),
        }
        pushReportEvent(Data)
        // const flagArr = ['prepc-real.headline.net', 'preh5-real.headline.net', 'www.headline.net']// pre环境
        // const flagArr = ['localhost:8080']// 本地环境
        const flagArr = ['www.headline.net']// prd环境
        if (!flagArr.includes(location.host)) return
        const appConfig = await initFirebase()
        const analytic = getAnalytics(appConfig)
        // console.log('埋点数据------>', analytic, event, resultParams)
        logEvent(analytic, event, resultParams, true)
    }
}

// 做个缓存
const pushReportEvent = (Data) => {
    const reportFail = []
    const local = parseJSON(localGet('localReportEvent')) || []
    if (Array.isArray(local) && local.length > 0) {
        localRemove('localReportEvent')
        local.forEach(item => {
            if (item.EventName) {
                ReportEvent({
                    body: { Data: item }
                }).then((res) => {
                    if (res.Code !== 1000) {
                        reportFail.push(item)
                    }
                }).catch(() => {
                    reportFail.push(item)
                })
            }
        })
    }
    ReportEvent({
        body: { Data }
    }).then((res) => {
        if (res.Code !== 1000) {
            reportFail.push(Data)
        }
    }).catch(() => {
        reportFail.push(Data)
    })
    if (reportFail.length > 0) {
        localSet('localReportEvent', JSON.stringify(reportFail))
    }
}

const verification = (event) => {
    const curtail = [ // 单用户一天一次
        'sign_up',
        'sign_up_code',
        'login',
        'login_code',
        'home_source',
        'ck_kyc_popup',
        'kyc_initiated',
        'kyc_write',
    ]
    let flag = true
    const local_userId = localGet('local_fs') // 本地存储用户标识
    const resEvent = md5(event)
    if (curtail.includes(event) && local_userId && typeof local_userId === 'string') {
        const [time, evt] = local_userId.split('_')
        const local_time = dayjs(time).format('YYYY-MM-DD')
        const now_time = dayjs().format('YYYY-MM-DD')
        if (local_time === now_time && evt.indexOf(resEvent) >= 0) { // 同一天已存储
            flag = false
        } else if (local_time === now_time) { // 同一天未存储
            localSet('local_fs', `${Date.now()}_${evt}${resEvent}`)
        } else { // 非同一天
            localSet('local_fs', `${Date.now()}_${resEvent}`)
        }
    } else if (curtail.includes(event)) {
        localSet('local_fs', `${Date.now()}_${resEvent}`)
    }
    return flag
}
