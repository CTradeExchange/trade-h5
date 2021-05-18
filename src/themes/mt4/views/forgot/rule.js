import { mobileReg, emailReg } from '@/utils/util'
export default {
    // type: {
    //     required: true,
    // },
    mobile: [
        {
            message: '请输入手机号',
            validator: (rule, value, callback, source, options) => {
                return source.type === 0 ? !!value : true
            },
        },
        {
            message: '请输入正确的手机号',
            validator: (rule, value, callback, source, options) => {
                return source.type === 0 ? source.mobileReg.test(value) : true
            }
        },

    ],
    email: [
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
    ],
    checkCode: {
        message: '请输入验证码',
        validator: (rule, value, callback, source, options) => {
            return source.needCheckCode && source.type === 0 ? !!value : true
        },
    },
    emailCode: {
        message: '请输入验证码',
        validator: (rule, value, callback, source, options) => {
            return source.needCheckCode && source.type === 1 ? !!value : true
        },
    }
}
