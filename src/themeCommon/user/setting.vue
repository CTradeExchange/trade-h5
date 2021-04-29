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
        <van-button class='logout-btn' :loading='loading' type='primary' @click='handleLogout'>
            <span>退出账号</span>
        </van-button>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { toRefs, reactive, ref, getCurrentInstance } from 'vue'
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
                // 退出登录 断开ws
                instance.appContext.config.globalProperties.$MsgSocket.ws.close()
                instance.appContext.config.globalProperties.$QuoteSocket.ws.close()
                store.dispatch('_user/logout')
            })
                .catch(() => {
                    // on cancel
                })
        }
        return {
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
