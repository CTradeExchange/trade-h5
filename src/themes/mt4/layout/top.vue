<template>
    <div class='top'>
        <a v-if='menu' class='icon_caidan1' href='javascript:;' @click="$emit('showLeftMenu')"></a>
        <a v-if='back' class='icon_fanhui' href='javascript:;' @click='$router.back()'></a>
        <div v-if='titleText' class='title'>
            <h2 v-if='titleText'>{{ titleText }}</h2>
            <p v-if='subTitle' class='subTitle'>{{ subTitle }}</p>
        </div>
        <topRight />
    </div>
</template>

<script>
import topRight from './topRight'
export default {
    components: {
        topRight,
    },
    props: {
        menu: {
            type: Boolean,
            default: true
        },
        back: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        subTitle: {
            type: String,
            default: ''
        },
    },
    computed: {
        titleText () {
            return this.title || this.$route.meta?.title
        },
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.top{
    position: relative;
    height: rem(90px);
    padding: 0 rem(30px);
    color: var(--white);
    background: var(--primary);
    display: flex;
    align-items: center;
    .icon_caidan{
        color: var(--white);
        font-size: 1.2em;
    }
    .title{
        position: relative;
        padding-left: rem(60px);
        margin-left: rem(20px);
        line-height: 1.4;
        flex: 1;
        &::before{
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            margin-top: rem(-25px);
            background: url('~@m/images/logo.png') no-repeat;
            background-size: auto 100%;
            width: rem(50px);
            height: rem(50px);
        }
        h2{
            font-size: rem(32px);
        }
        .subTitle{
            font-size: rem(24px);
        }
    }
    a{
        color: var(--white);
    }
}
</style>
