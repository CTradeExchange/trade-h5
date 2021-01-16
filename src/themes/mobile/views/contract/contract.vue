<template>
    <top
        back
        :menu='false'
        sub-title='Euro vs US Dollar'
        title='UERUSD'
    />
    <div>
        <van-cell size='large' title='点差' value='浮动' />
        <van-cell size='large' title='小数位' value='5' />
        <van-cell size='large' title='止损水平' value='8' />
        <van-cell size='large' title='合约数量' value='10000' />
        <van-cell size='large' title='利润计算模式' value='Forex' />
        <van-cell size='large' title='利润计算模式' value='Forex' />
        <van-cell size='large' title='利润计算模式' value='Forex' />
        <van-cell size='large' title='利润计算模式' value='Forex' />
        <van-cell size='large' title='利润计算模式' value='Forex' />
        <van-cell size='large' title='利润计算模式' value='Forex' />
    </div>
</template>

<script>
import top from '@m/layout/top'
export default {
    components: {
        top,
    },
}
</script>

<style lang="scss" scoped>

</style>
