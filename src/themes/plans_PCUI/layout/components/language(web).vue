<template>
    <el-dropdown @command='changeLangHandler' @visible-change='visibleChange'>
        <span class='el-dropdown-link cursor-pointer'>
            {{ currentLang }}
            <el-icon class='el-icon--right'>
                <img
                    alt='arrow'
                    :class="[visible ? 'rotate--180 ' : 'rotate-0']"
                    src='/images/arrow.svg'
                />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for='(item,index) in langActions' :key='index' :command='item.val'>
                    {{ item.name }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { setCookie } from '@/utils/util'
import { changeLang } from '@/api/base'
import { useI18n } from 'vue-i18n'
import i18n, { loadLocaleMessages } from '@planspc/i18n/i18n.js'

export default {
    components: {
    },
    setup () {
        const store = useStore()
        const customInfo = computed(() => store.state._user.customerInfo)
        const { locale } = useI18n({ useScope: 'global' })
        const state = reactive({
            langActions: store.state.supportLanguages,
            loading: false,
            visible: false
        })
        const currentLang = computed(() => {
            const item = state.langActions.find(item => item.val == locale.value)
            return item?.name
        })

        // 切换语言
        const changeLangHandler = (lang) => {
            if (lang === locale.value) return false
            state.loading = true
            // console.log('我选择了这个语言--->', lang)
            new Promise((resolve, reject) => {
                if (customInfo.value) {
                    return changeLang(lang).then(res => {
                        // console.log('传了字段给后端--->', res, res.check())
                        return res.check() ? resolve() : reject()
                    })
                } else {
                    resolve()
                }
            }).then(() => {
                state.loading = false

                // console.log('location------->', location)
                // 替换URL
                const str = location.pathname
                const firstSlash = str.indexOf('/') + 1
                const twoSlash = str.indexOf('/', firstSlash) // 第二个斜杠下标
                const pathTemp = str.substring(twoSlash).substring(1, str.length)
                const href = location.origin + '/' + lang + '/' + pathTemp + location.search
                location.href = href
                // console.log('location new herf------->', href)

                loadLocaleMessages(i18n, lang).then(() => {
                    // console.log('改变语言了--->', lang)
                    locale.value = lang // change!
                    store.commit('del_cacheViews', 'Home')
                    store.commit('del_cacheViews', 'Layout')
                    store.commit('Update_countryList', [])
                    store.commit('Update_countryListAll', [])
                })

                setCookie('lang', lang, 'y10')
            }).catch(err => (state.loading = false))
        }

        const visibleChange = (value) => {
            state.visible = value
        }
        return {
            ...toRefs(state),
            currentLang,
            changeLangHandler,
            visibleChange
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.el-dropdown{
  min-height: 36px;
  border-radius: 8px;
  padding: 6px 10px;
  border: 1px solid #F9F9FB;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;

}
</style>
