<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :menu='false' :title='$t("trade.trustList")' />
        <trustItem v-for='(item,index) in 20' :key='index' @click='toDetail' />
    </div>
</template>

<script>

import { useRouter } from 'vue-router'
export default {
    components: {
        trustItem
    },
    setup (props) {
        const router = useRouter()
        const toDetail = () => {
            router.push('/trustDetail?id=' + 4)
        }
        return {
            toDetail
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    height: 100%;
    padding-top: rem(95px);
    padding-right: rem(20px);
    padding-left: rem(20px);
    overflow: auto;
    background-color: var(--bgColor);
    .trust-item {
        margin-top: rem(20px);
    }
}
</style>
