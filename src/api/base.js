
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

/* 获取国家字典列表 */
export function getCountryListByParentCode (data) {
    return request({
        url: '/global/config.app.AppDictDubboService.getCountryListByParentCode',
        method: 'post',
        data
    })
}
/* 设置语言信息 */
export function changeLang (lang) {
    return request({
        url: '/global/customer.app.CustomerWebApiService.changeLang',
        method: 'post',
        headers: {
            version: '0.0.1',
        },
        data: { lang }
    })
}
