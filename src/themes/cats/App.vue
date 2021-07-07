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
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { MsgSocket } from '@/plugins/socket/socket'
export default {
    components: {
        Notice
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const tipTextCountDown = ref(t('confirm') + '(3s)')
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
            if (MsgSocket?.ws) MsgSocket.ws.close() // 断开msg ws链接
            let countNum = 3
            const countTimer = setInterval(() => {
                countNum--
                tipTextCountDown.value = `${t('confirm')}(${countNum}s)`
                if (countNum === 0) {
                    Dialog.close()
                    handlerLogout()
                    clearInterval(countTimer)
                }
            }, 1000)
            Dialog.alert({
                title: t('tip'),
                theme: 'round-button',
                message: t('c.otherPlaceLogin'),
                confirmButtonText: tipTextCountDown,
            }).then(() => {
                handlerLogout()
            })
        }

        document.documentElement.classList.add(store.state.invertColor)

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
