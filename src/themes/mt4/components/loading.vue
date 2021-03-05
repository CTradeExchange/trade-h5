<template>
    <van-popup
        v-model:show='visible'
        class='loadingPop'
        :close-on-click-overlay='false'
        lock-scroll
        :overlay-style="{ background: 'none' }"
        teleport='body'
    >
        <van-loading color='#fff' size='28px' />
    </van-popup>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: true
        },
        text: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            visible: this.show
        }
    },
    watch: {
        show (val) {
            this.visible = val
        }
    }
}
</script>

<style lang="scss" >
@import '@/sass/mixin.scss';
.loadingPop{
    padding: rem(20px);
    border-radius: rem(15px);
    background: #444;
}
</style>
