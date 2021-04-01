export default {
    userName: [
        {
            message: ['请输入持卡人姓名'],
            validator: (rule, value, callback, source, options) => {
                return !!value
            },
        }
    ],
    bankNo: [
        {
            message: ['请输入银行卡号'],
            validator: (rule, value, callback, source, options) => {
                return !!value
            },
        }
    ],
    bankName: [
        {
            message: ['请选择银行名称'],
            validator: (rule, value, callback, source, options) => {
                return !!value
            },
        }
    ],
    currency: [
        {
            message: ['请选择银行卡币种'],
            validator: (rule, value, callback, source, options) => {
                return !!value
            },
        }
    ],
    area: [
        {
            message: ['请选择开户地址'],
            validator: (rule, value, callback, source, options) => {
                return !!value
            },
        }
    ],
    bankArea: [
        {
            message: ['请输入开户行地址'],
            validator: (rule, value, callback, source, options) => {
                return !!value
            },
        }
    ]
}
