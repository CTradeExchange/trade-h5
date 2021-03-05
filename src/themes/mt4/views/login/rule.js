import { mobileReg, emailReg } from '@/utils/util'
export default {
    type: {
        required: true,
    },
    loginName: [
        {
            message: '请输入手机号',
            validator: (rule, value, callback, source, options) => {
                return source.type === 1 ? !!value : true
            },
        },
        {
            message: '请输入正确的手机号',
            validator: (rule, value, callback, source, options) => {
                return source.type === 1 ? mobileReg.test(value) : true
            },
        },
        {
            message: '请输入邮箱',
            validator: (rule, value, callback, source, options) => {
                return source.type === 2 ? !!value : true
            },
        },
        {
            message: '请输入正确的邮箱',
            validator: (rule, value, callback, source, options) => {
                return source.type === 2 ? emailReg.test(value) : true
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
