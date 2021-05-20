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
import Notice from '@m/components/notice'
import { useStore } from 'vuex'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
export default {
    components: {
        Notice
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        window.store = store

        // 用户被踢出消息
        const kickOut = () => {
            store.dispatch('_user/logout').then(() => {
                return router.push('/login')
            }).then(() => {
                location.reload()
            })
        }

        // 监听ws全局事件
        document.body.addEventListener('UserForceLogoutRet', kickOut, false)
        onMounted(() => {
            document.body.removeEventListener('UserForceLogoutRet', kickOut)
        })

        return {}
    },
    created () {
        window.vm = this
    },
}
</script>

<style lang="scss">
@import '~@m/style.scss';
@import '~@m/font/iconfont.css';
@import '~@/sass/mixin.scss';
</style>
