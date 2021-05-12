<template>
    <Top :back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <van-cell title='启用新闻'>
            <template #right-icon>
                <van-switch v-model='checked' active-color='#54C41C' size='24px' @change='changeNewsState' />
            </template>
        </van-cell>
        <van-cell is-link title='修改登录密码' to='/setLoginPwd' />
        <van-cell v-if='!customInfo.phone' is-link title='绑定手机' to='/bindMobile' />
        <van-cell v-if='!customInfo.email' is-link title='绑定邮箱' to='/bindEmail' />
        <van-button class='logout-btn' :loading='loading' type='primary' @click='handleLogout'>
            <span>退出账号</span>
        </van-button>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { toRefs, reactive, computed, getCurrentInstance, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'
import { isEmpty } from '@/utils/util'
import { useStore } from 'vuex'
export default {
    components: {
        Top
    },
    setup (props) {
        const instance = getCurrentInstance()
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            checked: false,
            loading: false
        })

        onBeforeMount(() => {
            if (!isEmpty(localStorage.getItem('openNews'))) {
                state.checked = JSON.parse(localStorage.getItem('openNews'))
            }
        })

        const changeNewsState = (state) => {
            localStorage.setItem('openNews', state)
        }

        const handleLogout = () => {
            Dialog.confirm({
                title: '提示',
                message: '确定退出登录吗',
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
