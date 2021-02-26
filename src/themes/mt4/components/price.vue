<template>
    <span v-show='mode===1' class='price'>1.55225</span>
    <span v-show='mode===2' class='price'>
        <span class='normal'>1.55</span>
        <span class='big'>22</span>
        <sup>5</sup>
    </span>
</template>

<script>
export default {
    props: {
        data: {
            type: [Number, String],
            default: ''
        },
        mode: {
            type: Number,
            default: 2
        },

    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.price{
    font-size: rem(30px);
    font-weight: bold;
    .normal{
        vertical-align: text-bottom;
    }
    .big{
        font-size: rem(46px);
    }
    sup{
        font-size: inherit;
    }
}
</style>
