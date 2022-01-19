<template>
    <span class='etfIcon'>
        etf
    </span>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.etfIcon{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background: var(--primary);
    border: 1px solid var(--primary);
    border-radius: 3px;
    text-transform: uppercase;
}
</style>
