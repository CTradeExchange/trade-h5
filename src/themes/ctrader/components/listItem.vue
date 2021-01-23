<template>
    <div class='titleBar of-1px-bottom'>
        <slot>
            <div v-for='item in title' :key='item.name' class='col'>{{ item.name }}</div>
        </slot>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: Array,
            default: []
        },
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.titleBar {
    display: flex;
    align-items: center;
    width: 100%;
    padding: rem(30px) rem(40px);
    color: var(--muted);
    font-size: rem(26px);
    text-align: center;
    .col {
        position: relative;
        flex: 1;
    }
}
</style>
