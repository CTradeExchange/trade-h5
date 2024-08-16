<template>
    <img alt='' class='icon icon_yuyan' src='../../../images/investingCom/language.png' style='width: 20px' />
    <el-dropdown>
        <i style='outline: unset !important' :title="$t('header.language')">
            <span class='el-dropdown-link'>
                <p><strong>{{ $t('navbarLanguage.navLanguage') }}</strong></p>
            </span>
        </i>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for='item in langActions' :key='item.val' @click='changeLangHandler(item.val)'>
                    {{ item.name }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script>
import i18n, { loadLocaleMessages } from '@planspc/i18n/i18n.js'
import { ArrowDown } from '@element-plus/icons-vue'
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { setCookie } from '@/utils/util'
import { changeLang } from '@/api/base'
import { useI18n } from 'vue-i18n'
import { Dialog } from 'vant'
export default {
    components: {
        ArrowDown
    },
    setup () {
        const store = useStore()
        const customInfo = computed(() => store.state._user.customerInfo)
        const { locale, t } = useI18n({ useScope: 'global' })
        const state = reactive({
            langActions: store.state.supportLanguages,
            loading: false,
        })

        const itemsLanguages = computed(() => {
            return store.state._base.supportedLanguages
        })

        // 切换语言
        const changeLangHandler = lang => {
            if (lang === locale.value) return false

            // 替换URL
            const str = location.pathname
            const searchStr = location.search
            const firstSlash = str.indexOf('/') + 1
            const twoSlash = str.indexOf('/', firstSlash) // 第二个斜杠下标
            const pathTemp = str.substring(twoSlash).substring(1, str.length)

            new Promise((resolve, reject) => {
                if ((pathTemp === 'infoDetail' || pathTemp === 'economicCalendar') && !itemsLanguages.value.includes(lang)) {
                    Dialog.alert({
                        title: t('common.tip'),
                        showCancelButton: true,
                        confirmButtonText: t('api.switchBtn'),
                        message: t('api.switchPrompt'),
                    }).then(() => {
                        resolve(location.origin + '/' + lang + '/home')
                    }).catch(() => reject(null))
                } else {
                    resolve(location.origin + '/' + lang + '/' + pathTemp + searchStr)
                }
            }).then((result) => {
                state.loading = true
                new Promise((resolve, reject) => {
                    if (customInfo.value) {
                        return changeLang(lang).then(res => {
                            return res.check() ? resolve() : reject()
                        })
                    } else {
                        resolve()
                    }
                }).then(() => {
                    state.loading = false
                    loadLocaleMessages(i18n, lang).then(() => {
                        locale.value = lang // change!
                        store.commit('del_cacheViews', 'Home')
                        store.commit('del_cacheViews', 'Layout')
                        store.commit('Update_countryList', [])
                        store.commit('Update_countryListAll', [])
                    })

                    setCookie('lang', lang, 'y10')
                    location.replace(result)
                }).catch(err => (state.loading = false))
            })
        }

        return {
          ...toRefs(state),
          changeLangHandler,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.icon {
  font-size: 18px;
  color: #D6DAE1;
  margin-right: 6px;
}
.el-dropdown-link{
  font-family: "Roboto";
  cursor: pointer;
  position: relative;
  left: 2px;
  display: flex;
  p{
      padding-top: 2px;
      font-size: 18px;
      color: #1A1B24;
  }
}
.el-icon--right{
  position: relative;
  font-weight:bolder
}
</style>
