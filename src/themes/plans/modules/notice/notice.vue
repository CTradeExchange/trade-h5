<template>
    <div class='notice' :style='data.styleObj'>
        <van-notice-bar background='#fff' color='#666' left-icon='volume-o' :scrollable='false'>
            <van-swipe
                :autoplay='3000'
                class='notice-swipe'
                :show-indicators='false'
                vertical
            >
                <van-swipe-item>17:23:36 150****5969 激活账户，获赠200美元；</van-swipe-item>
                <van-swipe-item>17:15:31 130****0899 平仓欧美，单笔赚223美元；</van-swipe-item>
                <van-swipe-item>17:03:56 156****2077 激活账户，获赠500美元；</van-swipe-item>
            </van-swipe>
        </van-notice-bar>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: [String, Object],
            default: {}
        },
    },
    created () {
        window.notice = this
        console.log(process.env.VUE_APP_h5Preview)
    },
    methods: {
        // 预览时使用
        refresh () {
            const notice = this.$refs.notice
            notice.reset()
            notice.start()
            console.log('refresh')
        }
    },
}
</script>

<style lang="scss" scoped>
.notice-swipe {
    height: 40px;
    line-height: 40px;
}
</style>
