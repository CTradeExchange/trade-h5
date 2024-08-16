import axios from 'axios'
import CheckAPI from '@/utils/checkAPI'

const service = axios.create({
    timeout: 20000
})

// 信号头部信息
const signalHeaders = {
    apiKey: '', // 信号apikey
    apiHost: '', // 信号接口域名
    valable: '', // 有价值接口域名
    valableApiKey: '' // 有价值apikey
}

export function setSignalHeaders (obj) {
    if (obj.apiKey) signalHeaders.apiKey = obj.apiKey
    if (obj.apiHost) signalHeaders.apiHost = obj.apiHost
    if (obj.valable) signalHeaders.valable = obj.valable
    if (obj.valableApiKey) signalHeaders.valableApiKey = obj.valableApiKey
}

// 请求拦截
service.interceptors.request.use(
    config => {
        config.method = config.method.toUpperCase()
        const { apiKey, apiHost, valable, valableApiKey } = signalHeaders
        const isValableAPI = config.url?.startsWith('/valuable')
        // 如果url是valuable开头的需要特殊处理
        if (isValableAPI) {
            config.url = config.url.replace('/valuable', '')
        }
        config.baseURL = isValableAPI ? valable : `https://${apiHost}`
        config.headers = {
            'x-api-key': isValableAPI ? valableApiKey : apiKey,
            ...config.header
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

// 请求响应
service.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            const res = response.data
            if (res?.errors) {
                return Promise.reject(new CheckAPI({
                    'code': '-1',
                    'data': res.errors[0]
                }))
            } else if (res.message) {
                // 有价值信号接口判断
                const { message, ...rest } = res
                if (message === 'ok') {
                    return Promise.resolve(new CheckAPI({
                        'code': '0',
                        'data': rest
                    }))
                } else {
                    return Promise.reject(new CheckAPI({
                        'code': '-1',
                        'data': message
                    }))
                }
            } else {
                const { type } = JSON.parse(response.config.data)
                return Promise.resolve(new CheckAPI({
                    'code': '0',
                    'data': res.data[type] || null
                }))
            }
        }
    },
    error => {
        return Promise.reject(new CheckAPI({
            'code': '-2',
            'data': error?.data?.errors[0] || error?.message
        }))
    }
)
export default service
