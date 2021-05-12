
import request from '@/utils/request'

/* 获取国家区号列表 */
export function getListByParentCode (data) {
    return request({
        url: '/global/config.app.AppDictDubboService.getListByParentCode',
        method: 'post',
        data
    })
}

/* 发送验证码 */
export function verifyCodeSend (data) {
    return request({
        url: '/global/message.app.VerificationApiService.verifyCodeSend',
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
        url: '/global/message.app.VerificationApiService.verifyCodeCheck',
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
        url: '/global/config.app.OpenDictDubboService.getListByParentCode',
        method: 'post',
        data
    })
}

/* 上传 */
export function upload (data) {
    return request({
        url: '/upload',
        method: 'post',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
        isUpload: true
    })
}
