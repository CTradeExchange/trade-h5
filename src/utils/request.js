import axios from 'axios'
import { guid, getLoginParams, getToken, removeLoginParams, getCookie, isDemoAccount, replaceBaseUrl, parseJSON } from '@/utils/util'
import { encryptParams } from '@/utils/requestEncrypt'
import { apiDomain } from '@/config'
import { setNewRouter } from './request_new'
import CheckAPI from './checkAPI'

var router = null
export const setRouter = r => {
    router = r
    setNewRouter(router)
}

// const baseURL = 'http://18.162.240.170:10000/cats-gateway'
const realApiDomain = apiDomain && apiDomain.startsWith('http') ? apiDomain : apiDomain
const baseURL = `${realApiDomain}/cats-gateway`
const development = process.env.NODE_ENV === 'development'

// create an axios instance
const service = axios.create({
    baseURL: baseURL, // url = base url + request url
    timeout: 60000 // request timeout
})
const headers = service.defaults.headers
headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// request interceptor
service.interceptors.request.use(
    config => {
        const headers = config.headers
        const companyId = sessionStorage.getItem('companyId')
        const token = getToken()
        const timestamp = Date.now()
        const SysSetting = parseJSON(window['wp_SysSetting']) || {}
        config.toastErr = config.toastErr ?? true
        headers.timestamp = timestamp
        // getSymbolBaseList接口lang传参单独处理 为了配合产品英文化 中文也使用英文symbolName
        headers.lang = config.url.indexOf('getSymbolBaseList') > -1 ? 'en-US' : getCookie('lang')
        if (token) headers.token = token
        headers.companyId = companyId
        headers.trace = SysSetting.pk ? 'x-' + guid() : guid()
        if (config.method === 'get') {
            config.params = Object.assign({}, config.params || {})
        } else if (config.method === 'post') {
            const postData = config.data
            if (!config.isUpload) {
                // window?.printLog('%c 请求原参数 %c ' + config.url, 'background-color:#5e5', 'background-color:#fe6', config.data)
                config.data = SysSetting.pk ? { data: encryptParams(config.data, timestamp, SysSetting.pk), ...(window.localStorage.getItem('__DEBUGGER__') || development ? { params: config.data } : {}) } : Object.assign({}, postData)
            }
        }
        config.baseURL = replaceBaseUrl(config.baseURL, 'apiService')
        return config
    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        const { data, config } = response
        const routeName = router?.currentRoute?._value?.name
        if (['GATEWAY_CODE_001', 'GATEWAY_CODE_005'].includes(data.code) && router && routeName !== 'Login') {
            removeLoginParams()
            let backPath = location.pathname.split('/')
            backPath.splice(1, 1)
            backPath = backPath.join('/')

            router.push({ name: 'Login', query: { back: encodeURIComponent(backPath + location.search) } }).then(() => {
                location.reload()
            })
        }

        const result = new CheckAPI(data)
        if (!result.check() && config.toastErr) {
            result.toast()
        }
        return result
    },
    error => {
        console.log(error, '====error')
        return Promise.reject(error)
    }
)

// 修改请求地址
// export const modifybaseURL = (baseURL) => {
//     service.defaults.baseURL = baseURL + '/cats-gateway'
// }
export const modifybaseURL = (baseURL) => {
    if (development) {
        baseURL = isDemoAccount() ? '/api/api_demo_url' : '/api/wwwmc900.com'
    }
    service.defaults.baseURL = baseURL + '/cats-gateway'
}

export default service
