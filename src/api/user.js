import request from '@/utils/request'
import { getDevice } from '@/utils/util'

/* 登录 */
export function login (data) {
    console.log('login')
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
/* 开交易账户 */
export function openAccount (data) {
    return request({
        url: '/global/customer.CustomerWebApiService.openAccount',
        method: 'post',
        data
    })
}
/* 检测客户信息是否存在 */
export function checkCustomerExist (data) {
    return request({
        url: '/global/customer.CustomerWebApiService.checkCustomerExist',
        method: 'post',
        data: {
            ...data,
        }
    })
}
/* 查询客户信息 */
export function findCustomerInfo (data) {
    return request({
        url: '/global/customer.CustomerWebApiService.findCustomerInfo',
        method: 'post',
        data
    })
}
