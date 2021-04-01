<template>
    <van-nav-bar
        left-arrow
        nav-bar-icon-color="red"
        :title='navTitle'
        @click-left='back'
    />
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
export default {
    setup (props, { emit, attrs }) {
        const router = useRouter()
        const route = useRoute()
        const navTitle = route.meta.title
        const back = () => {
            if (props.backHandler) emit('back')
            else router.back()
        }
        return { back, navTitle }
    }
}
</script>


<style lang="scss">
.van-nav-bar .van-icon {
    color: var(--color);
}
</style>