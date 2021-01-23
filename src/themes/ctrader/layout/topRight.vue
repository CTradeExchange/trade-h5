<template>
    <div class='rightActions'>
        <a href='javascript:;' @click="$router.push({ name:'Search' })">
            <i class='icon van-badge__wrapper van-icon van-icon-search'></i>
        </a>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.icon {
    color: var(--white);
    font-size: 1.5em;
    &:not(:first-of-type) {
        margin-left: .6em;
    }
}
</style>
