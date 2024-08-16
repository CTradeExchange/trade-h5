<template>
    <div class='floatTip'>
        <slot></slot>
    </div>
</template>

<script>
export default {
    setup () {
        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.floatTip {
    position: relative;
    z-index: 2000;
    top: 0;
    left: 0;
    width: 100%;
    height: rem(50px);
    color: var(--warn);
    line-height: rem(50px);
    text-align: center;
    background: #FFF0E2;
}
</style>
