<template>
    <router-view v-slot='{ Component, route }'>
        <keep-alive>
            <component :is='Component' v-if='route.meta.keepAlive' :key='route.fullPath' />
        </keep-alive>
        <component :is='Component' v-if='!route.meta.keepAlive' :key='route.fullPath' />
    </router-view>
    <Notice />
    <!-- <router-view />  -->
</template>

<script>
import Notice from '@c/components/notice'
import { useStore } from 'vuex'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'
export default {
    components: {
        Notice
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        window.store = store

        // 跳转到登录页面刷新
        const handlerLogout = () => {
            return store.dispatch('_user/logout').then(() => {
                return router.push('/login')
            }).then(() => {
                location.reload()
            })
        }

        // 用户被踢出消息
        const kickOut = () => {
            return handlerLogout()
        }

        // 用户异地登录
        const disconnect = () => {
            Dialog.alert({
                title: '提示',
                theme: 'round-button',
                message: '您的账号在异地登录，请重新登录',
            }).then(() => {
                handlerLogout()
            })
        }

        // 监听ws全局事件
        document.body.addEventListener('GotMsg_UserForceLogoutRet', kickOut, false)
        document.body.addEventListener('GotMsg_disconnect', disconnect, false)
        onMounted(() => {
            document.body.removeEventListener('GotMsg_UserForceLogoutRet', kickOut)
            document.body.removeEventListener('GotMsg_disconnect', kickOut)
        })

        return {}
    },
    created () {
        window.vm = this
    },
}
</script>

<style lang="scss">
@import '~@c/style.scss';
@import '~@c/font/iconfont.css';
@import '~@/sass/mixin.scss';
</style>
