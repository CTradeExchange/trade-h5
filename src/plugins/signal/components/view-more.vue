<template>
    <div class='viewMore'>
        <a @click='handleMore'>
            <slot>
                {{ $t('signal.common.viewMore') }}
            </slot>
        </a>
    </div>
</template>

<script>

export default {
    emits: ['click'],
    setup (_, { emit }) {
        // 更多
        const handleMore = () => {
            emit('click')
        }

        return {
            handleMore
        }
    }
}
</script>

<style lang="scss" scoped>
.viewMore {
    display: flex;
    justify-content: center;
    padding: 40px 0;
    a {
        min-width: 200px;
        height: 50px;
        padding: 0 16px;
        align-items: center;
        justify-content: center;
        display: flex;
        color: var(--primary);
        font-size: 16px;
        text-align: center;
        border-radius: 12px;
        border: 2px solid var(--lineColor);
        margin: 0 auto;
        cursor: pointer;
        white-space: pre;
        &:hover {
            border-color: var(--primary);
        }
    }
}
</style>
