import { mobileReg, emailReg } from '@/utils/util'
import { checkCustomerExist } from '@/api/user'

// 判断用户是否存在的接口参数效验
export const checkCustomerExistRule = {
    type: {
        required: true,
    },
    loginName: [
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
            message: '请输入手机号码',
            validator: (rule, value, callback, source, options) => {
                return source.type === 2 ? !!value : true
            },
        },
        {
            message: '请输入正确的手机号',
            validator: (rule, value, callback, source, options) => {
                return source.type === 2 ? source.mobileReg.test(value) : true
            }
        },
        {
            asyncValidator: (rule, value, callback, source, options) => {
                checkCustomerExist(source).then(res => {
                    if (res.check()) {
                        const msg = source.type === 2 ? '手机号已存在' : '邮箱已存在'
                        callback(res.data === 1 ? msg : undefined)
                    } else {
                        callback(res.errorMsg())
                    }
                }).catch(err => {
                    callback(err)
                })
            },
        },
    ],
    phoneArea: {
        message: '请输入手机区号',
        validator: (rule, value, callback, source, options) => {
            return source.type === 2 ? !!value : true
        },
    },
    protocol: {
        message: '请阅读并同意客户隐私保护政策、投资风险披露及免责声明',
        validator: (rule, value, callback, source, options) => {
            return !!source.protocol
        },
    }
}

// 开户参数效验
export default {
    ...checkCustomerExistRule,
    verifyCode: {
        required: true,
        message: '请输入验证码',
        // validator: (rule, value, callback, source, options) => {
        //     return options.loginType === 'checkCode' ? !!value : true
        // },
    },
    // loginPwd: {
    //     message: '请输入密码',
    //     validator: (rule, value, callback, source, options) => {
    //         return options.loginType === 'password' ? !!value : true
    //     },
    // },
}
