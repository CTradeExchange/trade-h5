import axios from 'axios'
import { CheckAPI_wp } from './checkAPI'
import { DERAULT_LANG, getCookie, getQueryString, langList } from '@/utils/util'

// create an axios instance
const service = axios.create({
    baseURL: window.wp_apiPath,
    timeout: 60000
})
const headers = service.defaults.headers
headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
service.interceptors.request.use(
    config => {
        const queryLang = getQueryString('lang')
        const lang = getCookie('lang') || queryLang || DERAULT_LANG
        if (langList.every(i => config.baseURL.indexOf(`/${i}/`) === -1)) {
            config.baseURL = '/' + lang + config.baseURL
        }
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
        // if the custom code is not 20000, it is judged as an error.
        return new CheckAPI_wp(response.data)
    },
    error => {
        const data = error.response.data
        const config = error.response.config
        console.log('api error', error.response) // for debug
        return Promise.reject(error)
    }
)

export default service
