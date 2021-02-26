import { Toast, Dialog } from 'vant'
export default class CheckAPI {
    constructor (data) {
        Object.assign(this, data)
    }

    // 检查接口是否正常
    check () {
        return parseInt(this.code) === 1
    }

    // 获取错误信息
    errorMsg () {
        let msg = this.msg || this.errMsg || this.message
        if (i18n.te('retMsg.' + this.msgCode)) {
            msg = i18n.t('retMsg.' + this.msgCode)
        }
        return msg
    }

    // toast提示错误信息
    toast () {
        const msg = this.errorMsg()
        Toast(msg)
    }

    // alert提示错误信息
    alert () {
        const msg = this.errorMsg()
        return Dialog.alert({
            title: i18n.t('tip'),
            message: msg,
            confirmButtonText: i18n.t('compLang.OK'),
        })
    }
}

export const CheckAPI_wp =  class {
    constructor (data) {
        Object.assign(this, typeof(data)==='string' ? {content:data}:data);
    }

    // 检查接口是否正常
    check () {
        return this.success && this.data;
    }

    // 获取错误信息
    errorMsg () {
        let msg = this.msg || this.errMsg || this.message
        if (i18n.te('retMsg.' + this.msgCode)) {
            msg = i18n.t('retMsg.' + this.msgCode)
        }
        return msg
    }

    // toast提示错误信息
    toast () {
        const msg = this.errorMsg()
        Toast(msg)
    }

    // alert提示错误信息
    alert () {
        const msg = this.errorMsg()
        return Dialog.alert({
            title: i18n.t('tip'),
            message: msg,
            confirmButtonText: i18n.t('compLang.OK'),
        })
    }
}
