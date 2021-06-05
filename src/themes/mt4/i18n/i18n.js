import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'

const i18n = createI18n({
    // something vue-i18n options here ...
    locale: 'zh-CN', // 设置语言
    messages: {
        'zh-CN': zhCN
    }
})

export default i18n
