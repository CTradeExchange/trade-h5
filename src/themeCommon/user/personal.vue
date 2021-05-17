<template>
    <Top :back='true' :menu='false' title='' @backEvent='back' />
    <div class='page-wrap'>
        <van-cell-group>
            <van-cell is-link title='身份验证' to='/authentication' />
            <van-cell is-link title='银行卡列表' to='/bankList' />
        </van-cell-group>
    </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import Top from '@m/layout/top'
import { toRefs, reactive, ref } from 'vue'
export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const back = () => {
            router.replace('/quote')
        }
        return {
            back
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
</style>
