<template>
    <div class='floatTipInfo'>
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
.floatTipInfo {
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    // height: 30px;
    color: var(--warn);
    line-height: 1.2;
    text-align: center;
    background: #FFF0E2;
    padding: 4px 10px;
    z-index: 1;
    transform: translateY(-100%);
    font-size: 14px;
}
</style>
