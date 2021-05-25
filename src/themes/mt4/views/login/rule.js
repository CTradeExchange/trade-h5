import { emailReg } from '@/utils/util'
import { checkCustomerExist } from '@/api/user'
export default {
    type: {
        required: true,
    },
    loginName: [
        {
            message: '请输入手机号',
            validator: (rule, value, callback, source, options) => {
                return source.type === 2 ? !!value : true
            },
        },
        {
            message: '请输入正确的手机号',
            validator: (rule, value, callback, source, options) => {
                return source.type === 2 ? source.mobileReg.test(value) : true
            },
        },
        {
            message: '请输入邮箱',
            validator: (rule, value, callback, source, options) => {
                return source.type === 1 ? !!value : true
            },
        },
        {
            message: '请输入正确的邮箱',
            validator: (rule, value, callback, source, options) => {
                return source.type === 1 ? emailReg.test(value) : true
            },
        },
        {
            asyncValidator: (rule, value, callback, source, options) => {
                checkCustomerExist(source).then(res => {
                    if (res.check()) {
                        const msg = source.type === 2 ? '手机号不存在' : '邮箱不存在'
                        callback(res.data === 2 ? msg : undefined)
                    } else {
                        callback(res.errorMsg())
                    }
                }).catch(err => {
                    callback(err)
                })
            },
        },
    ],
    verifyCode: {
        message: '请输入验证码',
        validator: (rule, value, callback, source, options) => {
            return options.loginType === 'checkCode' ? !!value : true
        },
    },
    loginPwd: {
        message: '请输入密码',
        validator: (rule, value, callback, source, options) => {
            return options.loginType === 'password' ? !!value : true
        },
    },
}
