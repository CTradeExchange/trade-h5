<template>
    <div class='page-wrap'>
        <van-nav-bar
            left-arrow
            title='取款记录'
            @click-left='back'
        />
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
    setup (props, { emit, attrs }) {
        const router = useRouter()
        const back = () => {
            if (props.backHandler) emit('back')
            else router.back()
        }

        return {
            back
        }
    }
}
</script>
