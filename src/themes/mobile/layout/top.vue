<template>
    <div class='top'>
        <a v-if='menuIcon' class='icon_caidan' href='javascript:;' @click="$emit('showLeftMenu')"></a>
        <div class='title'>
            <h2 v-if='title'>{{ title }}</h2>
            <p v-if='subTitle' class='subTitle'>{{ subTitle }}</p>
        </div>
        <div class='rightActions'>
            <a class='icon icon_jia' href='javascript:;'></a>
            <a class='icon icon_bianji' href='javascript:;'></a>
            <a class='icon icon_tianjia' href='javascript:;'></a>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        menuIcon: {
            type: Boolean,
            default: true
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
    .icon{
        font-size: 1.4em;
        &:not(:first-of-type){
            margin-left: .2em;
        }
    }
}
</style>
