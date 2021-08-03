import axios from 'axios'
import CheckAPI from './checkAPI'
import { login } from '@/api/user'
import { guid, getLoginParams, getToken, setToken, removeLoginParams, localGet } from '@/utils/util'
import { apiDomain } from '@/config'
let router = null
export const setRouter = r => (router = r)

// const baseURL = 'http://18.162.240.170:10000/cats-gateway'
const realApiDomain = apiDomain && apiDomain.startsWith('http') ? apiDomain : 'https:' + apiDomain
const baseURL = `${realApiDomain}/cats-gateway`

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
        config.toastErr = config.toastErr ?? true
        headers.trace = guid()
        headers.lang = localGet('lang')
        if (token) headers.token = token
        headers.companyId = companyId
        if (config.method === 'get') {
            config.params = Object.assign({}, config.params || {})
        } else if (config.method === 'post') {
            const postData = config.data

            if (!config.isUpload) {
                config.data = Object.assign({}, postData)
            }
        }
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
        // token失效重新登录
        const loginParams = getLoginParams()
        if (['GATEWAY_CODE_001', 'GATEWAY_CODE_005'].includes(data.code) && router) {
            removeLoginParams()
            router.push({ name: 'Login', query: { back: encodeURIComponent(location.pathname + location.search) } }).then(() => {
                location.reload()
            })
            // return login(loginParams).then(res => {
            //     setToken(res.data.token)
            //     config.headers.token = res.data.token
            //     return service({ ...config, data: JSON.parse(config.data) })
            // })
        }

        const result = new CheckAPI(data)
        if (!result.check() && config.toastErr) {
            result.toast()
        }
        return result
    },
    error => {
        return Promise.reject(error)
    }
)

export default service
