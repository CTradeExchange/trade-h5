
import request from '@/utils/request'

/* 获取国家区号列表 */
export function getListByParentCode (data) {
    return request({
        url: '/global/config.OpenDictDubboService.getListByParentCode',
        method: 'post',
        data
    })
}

/* 发送验证码 */
export function verifyCodeSend (data) {
    return request({
        url: '/global/message.VerificationApiService.verifyCodeSend',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 验证验证码 */
export function verifyCodeCheck (data) {
    return request({
        url: '/global/message.VerificationApiService.verifyCodeCheck',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data
    })
}

/* 获取银行卡列表 */
export function getBankDict (data) {
    return request({
        url: '/global/config.OpenDictDubboService.getListByParentCode',
        method: 'post',
        data
    })
}
