import axios from 'axios'
import CheckAPI from './checkAPI'
import { login } from '@/api/user'
import { guid, getLoginParams } from '@/utils/util'
import { apiDomain } from '@/config'

// const baseURL = 'http://18.162.240.170:10000/cats-gateway'
const baseURL = `${apiDomain}/cats-gateway`

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
        const token = sessionStorage.getItem('token')
        config.toastErr = config.toastErr ?? true
        headers.trace = guid()
        if (token) headers.token = token
        headers.companyId = companyId
        if (config.method === 'get') {
            config.params = Object.assign({}, config.params || {})
        } else if (config.method === 'post') {
            const postData = config.data
            config.data = Object.assign({}, postData)
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
        if (data.code === 'GATEWAY_CODE_005') {
            const loginParams = getLoginParams()
            return login(loginParams).then(res => {
                sessionStorage.setItem('token', res.data.token)
                config.headers.token = res.data.token
                return service({ ...config, data: JSON.parse(config.data) })
            })
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
