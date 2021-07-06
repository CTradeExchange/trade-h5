<template>
    <LayoutTop :back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <van-cell :title='$t("setting.enableNews")'>
            <template #right-icon>
                <van-switch v-model='checked' active-color='#54C41C' size='24px' @change='changeNewsState' />
            </template>
        </van-cell>
        <van-cell v-if='customInfo' is-link :title='$t(Number(customInfo.loginPassStatus) === 1 ?"forgot.setPwd" : "login.modifyLoginPwd")' to='/setLoginPwd' />
        <van-cell v-if='customInfo && !customInfo.phone' is-link :title='$t("setting.bindPhone")' to='/bindMobile' />
        <van-cell v-if='customInfo && !customInfo.email' is-link :title='$t("setting.bindEmail")' to='/bindEmail' />
        <van-cell v-if='customInfo && customInfo.email' is-link :title='$t("setting.replaceEmail")' to='/changeBindEmail' />
        <van-cell v-if='customInfo && customInfo.phone' is-link :title='$t("setting.replacePhone")' to='/changeBindMobile' />
        <van-cell is-link :title='$t("setting.setLang")' :value='langText' @click='langVisible=true' />
        <van-cell is-link :title='$t("setting.color")' :value='colorText' @click='colorVisible=true' />

        <van-button class='logout-btn' :loading='loading' type='primary' @click='handleLogout'>
            <span>{{ $t("setting.logout") }}</span>
        </van-button>

        <van-action-sheet v-model:show='langVisible' :actions='langActions' @select='langSelect' />
        <van-action-sheet v-model:show='colorVisible' :actions='colorsActions' @select='colorSelect' />
        <Loading :show='loading' />
    </div>
</template>

<script>
import { toRefs, reactive, computed, getCurrentInstance, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'
import { isEmpty, removeLoginParams, localSet, localGet } from '@/utils/util'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { changeLang } from '@/api/base'
export default {
    setup (props) {
        const instance = getCurrentInstance()
        const { t } = useI18n({ useScope: 'global' })
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const colorsActions = [
            { val: 'night', name: '黑夜' },
            { val: 'light', name: '白天' },
        ]

        const store = useStore()
        const router = useRouter()
        const state = reactive({
            checked: false,
            loading: false,
            langVisible: false,
            colorVisible: false,
            lang: localGet('lang') || store.state._base.wpCompanyInfo.language,
            langActions: store.state.supportLanguages
        })
        const langText = computed(() => {
            const curLang = state.langActions.find(el => el.val === state.lang)
            return curLang ? curLang.name : ''
        })
        const colorText = computed(() => {
            const cur = colorsActions.find(el => el.val === store.state.invertColor)
            return cur ? cur.name : ''
        })

        onBeforeMount(() => {
            if (!isEmpty(localGet('openNews'))) {
                state.checked = JSON.parse(localGet('openNews'))
            }
        })

        const changeNewsState = (state) => {
            localSet('openNews', state)
        }

        const handleLogout = () => {
            Dialog.confirm({
                theme: 'round-button',
                title: t('common.tip'),
                message: t('setting.logoutConfirm'),
            }).then(() => {
                state.loading = true
                // 退出登录
                instance.appContext.config.globalProperties.$MsgSocket.logout()
                return store.dispatch('_user/logout')
            }).then(() => {
                return router.push('/login')
            }).then(() => {
                location.reload()
            }).catch(() => {
                // on cancel
            })
        }

        // 选择语言
        const langSelect = (action) => {
            state.loading = true
            changeLang(action.val).then(res => {
                state.loading = false
                if (res.check()) {
                    state.langVisible = false
                    state.lang = action.val
                    localSet('lang', action.val)
                }
            }).catch(err => (state.loading = false))
        }

        // 选择颜色
        const colorSelect = (action) => {
            const classList = document.documentElement.classList
            if (action.val === 'light') {
                classList.remove('night')
            } else if (action.val === 'night') {
                classList.remove('light')
            }
            if (!classList.contains(action.val)) classList.add(action.val)
            store.commit('Update_invertColor', action.val)
            state.colorVisible = false
        }

        return {
            colorsActions,
            customInfo,
            handleLogout,
            changeNewsState,
            langText,
            langSelect,
            colorSelect,
            colorText,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    overflow: auto;
    .logout-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: var(--bdColor);
        border-color: var(--bdColor);
        span {
            color: var(--color);
            font-size: rem(34px);
        }
    }
}
</style>
