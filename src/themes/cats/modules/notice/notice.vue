<template>
    <div class='notice' :style='data.styleObj'>
        <van-notice-bar
            ref='notice'
            left-icon='volume-o'
            :text='data.text'
            @click='openurl(data)'
        />
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
</style>
