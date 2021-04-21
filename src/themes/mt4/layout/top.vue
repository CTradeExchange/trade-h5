<template>
    <div class='top'>
        <a v-if='menu' class='icon_caidan1' href='javascript:;' @click='$refs.leftMenu.visible=true'>
        </a>
        <a v-if='back' class='icon_fanhui' href='javascript:;' @click='$router.back()'></a>

        <div v-if='titleText && titleVis' class='title'>
            <h2 v-if='titleText'>
                {{ titleText }}
            </h2>
            <p v-if='subTitle' class='subTitle'>
                {{ subTitle }}
            </p>
        </div>
        <slot name='left'></slot>
        <slot name='right'></slot>
        <!-- <topRight /> -->
    </div>

    <leftMenu ref='leftMenu' />
</template>

<script>
import topRight from './topRight'
import leftMenu from './leftMenu'
export default {
    components: {
        topRight,
        leftMenu,
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
        titleVis: {
            type: Boolean,
            default: true
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
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.top {
    position: relative;
    display: flex;
    align-items: center;
    //justify-content: space-between;
    height: rem(90px);
    padding: 0 rem(30px);
    color: var(--white);
    background: var(--primary);
    .icon_caidan {
        color: var(--white);
        font-size: 1.2em;
    }
    .title {
        position: relative;
        flex: 1;
        margin-left: rem(20px);
        padding-left: rem(60px);
        line-height: 1.4;
        &::before {
            position: absolute;
            top: 50%;
            left: 0;
            width: rem(50px);
            height: rem(50px);
            margin-top: rem(-25px);
            background: url('~@m/images/logo.png') no-repeat;
            background-size: auto 100%;
            content: '';
        }
        h2 {
            font-size: rem(32px);
        }
        .subTitle {
            font-size: rem(24px);
        }
    }
    a {
        color: var(--white);
    }
}
</style>
