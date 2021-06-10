<template>
    <LayoutTop :back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <van-cell :title='$t("setting.enableNews")'>
            <template #right-icon>
                <van-switch v-model='checked' active-color='#54C41C' size='24px' @change='changeNewsState' />
            </template>
        </van-cell>
        <van-cell is-link :title='$t(Number(customInfo.loginPassStatus) === 1 ?"forgot.setPwd" : "login.modifyLoginPwd")' to='/setLoginPwd' />
        <van-cell v-if='!customInfo.phone' is-link :title='$t("setting.bindPhone")' to='/bindMobile' />
        <van-cell v-if='!customInfo.email' is-link :title='$t("setting.bindEmail")' to='/bindEmail' />
        <van-cell v-if='customInfo.email' is-link :title='$t("setting.replaceEmail")' to='/changeBindEmail' />
        <van-cell v-if='customInfo.phone' is-link :title='$t("setting.replacePhone")' to='/changeBindMobile' />
        <van-button class='logout-btn' :loading='loading' type='primary' @click='handleLogout'>
            <span>{{ $t("setting.logout") }}</span>
        </van-button>
    </div>
</template>

<script>
import { toRefs, reactive, computed, getCurrentInstance, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'
import { isEmpty, removeLoginParams, localSet, localGet } from '@/utils/util'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
export default {
    setup (props) {
        const instance = getCurrentInstance()
        const { t } = useI18n({ useScope: 'global' })
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const store = useStore()
        const router = useRouter()
        const state = reactive({
            checked: false,
            loading: false
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
        return {
            customInfo,
            handleLogout,
            changeNewsState,
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
