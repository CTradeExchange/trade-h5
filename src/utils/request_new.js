import axios from 'axios'
import { localGet, removeLoginParams } from '@/utils/util'

var router = null
export const setNewRouter = r => (router = r)

const beforeFetch = (options) => {
    const token = localGet('newsToken')
    if (!options.headers) options.headers = {}
    token && (options.headers.token = token)
    return options
}

const errorFetch = (res) => {
    const { data, status } = res.response || {}
    const { Code } = data || {}
    if (status === 401) {
        removeLoginParams()
        let backPath = location.pathname.split('/')
        backPath.splice(1, 1)
        backPath = backPath.join('/')
        router.push({ name: 'Login', query: { back: encodeURIComponent(backPath + location.search) } }).then(() => {
            location.reload()
        })
    } else if (Code !== 1000) {
        // 提示文案
    }
    return Promise.reject(data)
}

const afterFetch = (res) => {
    const { Code } = res.data || {}
    if (Code !== 1000) {
        return Promise.reject(res.data)
    }
    return res.data || {}
}

const baseURL = () => {
    if (process.env.NODE_ENV === 'development') return 'https://pre-news-test.headline.net'
    const base = window.location.host.indexOf('pre') === 0 ? 'https://pre-news-test.headline.net' : 'https://news-prd.headline.net'

    return base
}

const instance = axios.create({
    baseURL: baseURL(),
    timeout: 1000 * 60,
})

// 添加请求拦截器
instance.interceptors.request.use(beforeFetch, errorFetch)
instance.interceptors.response.use(afterFetch, errorFetch)

const methods = ['post']
const request = {}

methods.forEach((method) => {
    request[method] = (path, { body } = {}, config = {}) => {
        return instance({
            method,
            url: path,
            data: body,
            ...config,
        })
    }
})

export default (method, url, config) => (parmas) =>
    request[method](url, parmas, config)
