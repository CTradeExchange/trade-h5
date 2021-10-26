import { emailReg } from '@/utils/util'
export default (t) => {
    return {
        type: {
            required: true,
        },
        loginName: [
            {
                message: t('login.loginNamePlaceholder'),
                validator: (rule, value, callback, source, options) => {
                    return !!value
                },
            },
            {
                message: t('common.inputRealEmail'),
                validator: (rule, value, callback, source, options) => {
                    const isEmail = value.includes('@')
                    return isEmail ? emailReg.test(value) : true
                },
            }
        ],
        verifyCode: {
            message: t('common.inputVerifyCode'),
            validator: (rule, value, callback, source, options) => {
                return options.loginType === 'checkCode' ? !!value : true
            },
        },
        loginPwd: {
            message: t('common.inputPwd'),
            validator: (rule, value, callback, source, options) => {
                // console.log(rule, value, callback, source, options)
                return options.loginType === 'password' ? !!value : true
            },
        },
    }
}
