<template>
    <LayoutTop :back='true' :menu='false' title='' @backEvent='back' />
    <div class='page-wrap'>
        <van-cell-group>
            <van-cell is-link :title='$t("cRoute.authentication")' to='/authentication' />
            <van-cell is-link :title='$t("cRoute.bankList")' to='/bankList' />
            <van-cell is-link :title='$t("cRoute.walletAddress")' to='/walletAddress' />
        </van-cell-group>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
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
