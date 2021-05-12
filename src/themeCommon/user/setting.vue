<template>
    <Top :back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <van-cell title='启用新闻'>
            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            <template #right-icon>
                <van-switch v-model='checked' active-color='#54C41C' size='24px' />
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
import { toRefs, reactive, computed, ref, getCurrentInstance } from 'vue'
import { logout } from '@/api/user'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'
import { removeLoginParams } from '@/utils/util'
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
        const state = reactive({
            checked: false,
            loading: false
        })
        const router = useRouter()

        const handleLogout = () => {
            Dialog.confirm({
                title: '提示',
                message: '确定退出登录吗',
            }).then(() => {
                state.loading = true
                // 退出登录
                instance.appContext.config.globalProperties.$MsgSocket.logout()
                store.dispatch('_user/logout')
            })
                .catch(() => {
                    // on cancel
                })
        }
        return {
            customInfo,
            handleLogout,
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
