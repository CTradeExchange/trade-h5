import { bankNoReg } from '@/utils/util'
export default {
    bankAccountName: [
        {
            message: ['请输入持卡人姓名'],
            validator: (rule, value, callback, source, options) => {
                return !!value
            },
        }
    ],
    bankCardNumber: [
        {
            message: ['请输入银行卡号'],
            validator: (rule, value, callback, source, options) => {
                return !!value
            },
        },
        {
            message: ['请输入正确的银行卡号'],
            validator: (rule, value, callback, source, options) => {
                return bankNoReg.test(value)
            }

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
    bankCurrency: [
        {
            message: ['请选择银行卡币种'],
            validator: (rule, value, callback, source, options) => {
                return !!value
            },
        }
    ],
    province: [
        {
            message: ['请选择开户地址'],
            validator: (rule, value, callback, source, options) => {
                return !!value
            },
        }
    ],
    bankAddress: [
        {
            message: ['请输入开户行地址'],
            validator: (rule, value, callback, source, options) => {
                return !!value
            },
        }
    ]
}
