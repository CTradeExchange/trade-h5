<template>
    <div class='item-unsupported'>
        <div>
            <span>{{ content }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: String,
            default: ''
        },
    },
}
</script>

<style lang="scss" scoped>
.item-unsupported {
    & > div {
        color: var(--primary);
        height: 20px;
        max-width: 100px;
        padding:5px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 12px;
        font-size: 12px;
        background-color: rgba(255, 234, 237, 1);
        border-radius: 2px;
    }
}
</style>
