<template>
    <div class='BanderBanner'>
        <van-swipe :loop='false' :show-indicators='false' :width='300'>
            <van-swipe-item v-for='item in list' :key='item.img' class='item'>
                <a v-if='item.href' href='javascript:;' @click='openUrl(item.href)'>
                    <img :src='item.img' />
                </a>
                <img v-else :src='item.img' />
            </van-swipe-item>
        </van-swipe>
    </div>
</template>

<script>
export default {
    props: ['list'],
    setup () {
        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.BanderBanner {
    margin: 0 rem(30px);
    .item {
        padding-right: rem(30px);
    }
    img {
        width: 100%;
    }
}
</style>
