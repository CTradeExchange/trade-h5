<template>
    <a id='my-sign-twitter' class='loginByGoogle'>
        <i class='icon'></i>
    </a>
</template>

<script>
import loadScript from '@/utils/loadScript'
export default {
    mounted () {
        // this.renderBtn()
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.loginByGoogle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(80px);
    height: rem(80px);
    border: 1px solid var(--lineColor);
    border-radius: 50%;
    .icon {
        display: inline-block;
        width: rem(46px);
        height: rem(46px);
        background-image:  url('/images/twitter.png');
        background-size: 100%;
    }
}
</style>
