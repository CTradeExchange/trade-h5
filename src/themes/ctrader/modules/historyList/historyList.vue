<template>
    <div>
        <listItem :title='title' />
        <listItem v-for='item in list' :key='item' :title='title'>
            <span class='productName'>
                <i class='van-badge__wrapper van-icon van-icon-success'></i>
                EURCAD
            </span>
            <span class='flex1'>
                <i class='iconArrow icon_zhang riseColor'></i>
                0.01手数
            </span>
            <div class='ft price riseColor'>
                <span class='alignmiddle'>-34.66</span>
            </div>
        </listItem>
        <div class='profitLoss'>
            <span>实际盈亏</span>
            <span class='riseColor'>0.04</span>
        </div>
        <p class='tips'>
            History may be truncated, full history is available on the desktop.
        </p>
    </div>
</template>

<script>
import listItem from '@ct/components/listItem'
export default {
    components: {
        listItem,
    },
    data () {
        return {
            title: [
                { name: '交易商品' },
                { name: '仓位' },
                { name: '净盈亏' },
            ],
            list: [...new Array(5)]
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.productName {
    color: var(--color);
    .van-icon {
        display: inline-block;
        width: rem(50px);
        color: var(--success);
        font-size: rem(30px);
        vertical-align: -2px;
    }
}
.flex1 {
    flex: 1;
}
.ft {
    width: 22%;
    text-align: left;
}
.iconArrow {
    font-size: 1.2em;
}
.tips {
    margin: 0 rem(22px);
    color: var(--mutedColor);
    font-size: rem(24px);
}
.profitLoss {
    display: flex;
    justify-content: space-between;
    margin: rem(20px) rem(22px);
}
</style>
