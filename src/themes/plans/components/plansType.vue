<template>
    <div class='playType'>
        <span v-for='item in props.list' :key='item.id' class='item' :class='{ active: props.value === item.id }' @click='() => onClick(item)'>
            {{ item.name }}
        </span>
    </div>
</template>

<script>

export default {
    props: {
        value: {
            type: [Number, String],
            default: ''
        },
        list: {
            type: Array,
            default: () => []
        }
    },
    setup (props, context) {
        const onClick = (item) => {
            context.emit('change', item.id)
        }
        return {
            onClick,
            props
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.playType {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    height: rem(100px);
    padding-left: rem(30px);
    background-color: var(--contentColor);
    border: 1px solid var(--bgColor);
    .item {
        margin-left: rem(55px);
        color: var(--minorColor);
        font-weight: bold;
        font-size: rem(28px);
        white-space: nowrap;
        &:first-child {
            margin-left: 0;
        }
        &.active {
            color: var(--color);
            font-weight: bold;
            font-size: rem(38px);
        }
    }
}
</style>
