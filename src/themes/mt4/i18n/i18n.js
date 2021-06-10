import { createI18n } from 'vue-i18n'
import zhCN_common from '../../../themeCommon/i18n/zh-CN.json'
import zhCN from './zh-CN.json'

const i18n = createI18n({
    // something vue-i18n options here ...
    locale: 'zh-CN', // 设置语言
    messages: {
        'zh-CN': Object.assign(zhCN_common, zhCN)
    }
})

export default i18n
