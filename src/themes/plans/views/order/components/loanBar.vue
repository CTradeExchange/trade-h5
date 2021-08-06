<template>
    <div class='loanBar'>
        <div class='item sell' :class="{ 'active':modelValue===2 }" @click='setValue(2)'>
            <span class='hd'>
                自动借款
            </span>
            <span class='ft'>
                <van-icon name='question-o' @click.stop='tips' />
            </span>
        </div>
        <div class='item buy' :class="{ 'active':modelValue===3 }" @click='setValue(3)'>
            <span class='hd'>
                自动还款
            </span>
            <span class='ft'>
                <van-icon name='question-o' @click.stop='tips' />
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const tips = (data) => {
            console.log(data)
        }
        const setValue = (data) => {
            if (props.modelValue === data) data = 1
            emit('update:modelValue', data)
        }
        return {
            setValue,
            tips,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.loanBar {
    position: relative;
    display: flex;
    .item {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        height: rem(80px);
        padding: rem(10px) rem(20px);
        color: var(--color);
        line-height: rem(60px);
        background: var(--assistColor);
        border-radius: rem(6px);
        &.sell {
            margin-right: 5px;
            padding-right: rem(45px);
        }
        &.buy {
            margin-left: 5px;
            padding-left: rem(45px);
        }
        &.active {
            color: var(--primary);
            background: var(--primaryAssistColor);
        }
    }
    .price {
        font-size: rem(28px);
    }
    .van-icon-question-o {
        font-size: rem(30px);
    }
}
</style>
