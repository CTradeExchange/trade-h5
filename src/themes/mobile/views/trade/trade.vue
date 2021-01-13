<template>
    <div>
        <CapitalList :data='capitalListData' />
        <div class='titleBar'>
            价位
        </div>
        <PositionList />
    </div>
</template>

<script>
import CapitalList from '@m/components/capitalList'
import PositionList from '@m/modules/positionList/positionList'
export default {
    components: {
        CapitalList,
        PositionList,
    },
    data () {
        return {
            capitalListData: [
                { title: '结余：', value: '1000000.00' },
                { title: '净值：', value: '1000000.00' },
                { title: '可用预付款：', value: '1000000.00' },
                { title: '预付款比率(%)：', value: '1000000.00' },
                { title: '预付款：', value: '1000000.00' },
            ]
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.titleBar{
    height: rem(60px);
    line-height: rem(60px);
    padding: 0 rem(40px);
    font-size: rem(28px);
    background: var(--bgColor);
    border:1px solid rgba($color: #000000, $alpha: .1);
    border-width:1px 0 1px;
    box-shadow: 0 1px 0 rgba($color: #fff, $alpha: 1.0) inset;
}
</style>
