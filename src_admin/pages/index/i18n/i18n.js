// import { createI18n } from 'vue-i18n'
// // import zh_CN from './zh-CN.json' 
// // import en from './en-US.json'

// const loadLocaleMessages =()=> {
//     const locales = require.context('../i18n', true, /[A-Za-z0-9-_,\s]+\.js$/i)
//     const messages = {}

//     locales.keys().forEach(key => {
//         const matched = key.match(/([A-Za-z0-9-_]+)\./i)

//         if (matched && matched.length > 1) {
//         const locale = matched[1]
//         messages[locale] = locales(key).default
//         }
//     })

//     return messages
// }
// const i18n = createI18n({
//   // legacy: false, // Composition API 模式
//   globalInjection: true, // 全局注册 $t方法
//   fallbackLocale: 'zh_CN',
//   silentTranslationWarn:true,
//   locale: localStorage.getItem('language') || 'zh_CN',
//   messages: loadLocaleMessages
// })

// export default i18n
import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import {localGet} from '@/utils/util';

const defaultLocal = localGet('lang')

const i18n = setupI18n(defaultLocal)

export default i18n

export function setupI18n(locale) {
    const i18n = createI18n({ locale })
    setI18nLanguage(i18n, locale)
    return i18n
}

export function setI18nLanguage(i18n, locale) {
    if (i18n.mode === 'legacy') {
        i18n.global.locale = locale
    } else {
        i18n.global.locale.value = locale
    }
    /**
     * NOTE:
     * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
     * The following is an example for axios.
     *
     * axios.defaults.headers.common['Accept-Language'] = locale
     */
    document.querySelector('html').setAttribute('lang', locale)
}

export async function loadLocaleMessages(i18n, locale) {
    // load locale messages with dynamic import
    const messages = await import(/* webpackChunkName: "locale-[request]" */ `./${locale}.json`)
    //const commonMessages = await import(/* webpackChunkName: "locale-[request]" */ `@/themeCommon/i18n/${locale}.json`)
    //const newMessages = Object.assign({},commonMessages.default, messages.default)
    // set locale and locale message
    i18n.global.setLocaleMessage(locale, messages)

    return nextTick()
}