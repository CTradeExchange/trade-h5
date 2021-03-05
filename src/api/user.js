import request from '@/utils/request'
import { getDevice } from '@/utils/util'

/* 登录 */
export function login (data) {
    return request({
        url: '/login/customer.CustomerWebApiService.login',
        method: 'post',
        // toastErr: false,
        data: {
            device: getDevice(),
            ...data,
        }
    })
}

/* 注册 */
export function register (data) {
    return request({
        url: '/global/customer.CustomerWebApiService.register',
        method: 'post',
        data: {
            registerSource: getDevice(),
            ...data,
        }
    })
}
