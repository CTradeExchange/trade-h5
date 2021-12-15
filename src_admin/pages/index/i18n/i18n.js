// export default i18n
import { createI18n } from 'vue-i18n'
import { nextTick } from 'vue'
import {localGet,localSet} from '@/utils/util';

const defaultLocal = localGet("lang") || getUrlLang()
const i18n = setupI18n(defaultLocal)

export default i18n

export function setupI18n(locale) {
    //const messages = loadLocaleMessages();
    const i18n = createI18n({ locale})
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
    const messages = await import(/* webpackChunkName: "locale-[request]" */ `./${locale}.json`)
    i18n.global.setLocaleMessage(locale, messages)

    return nextTick()
}
// export function loadLocaleMessages(lang) {
//     const locale = lang||defaultLocal;
//     const locales = require.context('../i18n', true, /[A-Za-z0-9-_,\s]+\.json$/i)
//     const messages = {}
//     locales.keys().forEach(key => {
//         if(key.indexOf(locale)!=-1){
//             const matched = key.match(/([A-Za-z0-9-_]+)\./i)
//             if (matched && matched.length > 1) {
//                 const locale = matched[1]
//                 messages[locale] = locales(key)
//             }
//         }

//     })
//     return messages
// }
export function getUrlLang(){
    const hashArr = location.hash.split('&')
    let lang = 'zh-CN';
    // hashArr.forEach(item=>{
    //     if(item.indexOf("lang")!=-1||item.indexOf("language")!=-1){
    //         lang = item.substring()
    //         lang = item.substring(item.indexOf("=")+1)
    //     }
    // })
    localSet("lang",lang)
    return lang;
}
