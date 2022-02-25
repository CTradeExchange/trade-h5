export default function name (t, customerInfo) {
    return {
        googleCode: {
            required: true,
            message: '请输入谷歌验证码',
        },
        verifyCodeSMS: {
            required: !!customerInfo.phone,
            message: '请输入短信验证码',
        },
        verifyCodeEmail: {
            required: !!customerInfo.email,
            message: '请输入邮箱验证码',
        },
    }
}
