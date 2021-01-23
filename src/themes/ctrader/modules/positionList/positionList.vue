<template>
    <div>
        <listItem :title='title' />
        <listItem v-for='item in list' :key='item' :title='title'>
            <span class='productName'>
                <i class='van-badge__wrapper van-icon van-icon-success'></i>
                EURCAD
            </span>
            <span class='flex1'>
                <i class='iconArrow icon_down-jiantou-right riseColor'></i>
                0.01手数
            </span>
            <div class='ft price riseColor'>
                <van-icon class='iconClose' name='cross' />
                <span class='alignmiddle'>-34.66</span>
            </div>
        </listItem>
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
            list: [...new Array(30)]
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
    width: 25%;
}
.iconArrow {
    font-size: 1.2em;
}
.iconClose {
    float: right;
    color: var(--color);
    font-size: rem(36px);
    vertical-align: middle;
}
</style>
