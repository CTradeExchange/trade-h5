<template>
    <div class='top'>
        <a v-if='menu' class='icon_caidan' href='javascript:;' @click="$emit('showLeftMenu')"></a>
        <a v-if='back' class='van-badge__wrapper van-icon van-icon-arrow-left' href='javascript:;' @click='$router.back()'></a>
        <div class='center'>
            <slot></slot>
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
            default: false
        },
        back: {
            type: Boolean,
            default: true
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
.top {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: rem(90px);
    padding: 0 rem(30px);
    color: var(--white);
    background: var(--primary);
    .icon_caidan {
        color: var(--white);
        font-size: 1.2em;
    }
    .van-icon-arrow-left {
        font-size: rem(44px);
    }
    a {
        color: var(--white);
    }
    .center {
        flex: 1;
    }
}
</style>
