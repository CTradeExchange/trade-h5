import axios from 'axios'
import CheckAPI from './checkAPI'
import { guid } from '@/utils/util'

const baseURL = 'http://10.186.20.102:10000/cats-gateway'

// create an axios instance
const service = axios.create({
    baseURL: baseURL, // url = base url + request url
    timeout: 60000 // request timeout
})
const headers = service.defaults.headers
headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
headers.companyId = 1
headers.version = '0.0.1'
// request interceptor
service.interceptors.request.use(
    config => {
        let language="zh-CN"
        const headers = config.headers
        headers.trace = guid()
        config.responseType = config.responseType || ''
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
        const res = response.data

        const result = new CheckAPI(res)
        return result
    },
    error => {
        return Promise.reject(error)
    }
)

export default service
