<template>
    <div>
        <CapitalList class='of-1px-bottom' :data='capitalListData' />
        <Balance />
        <PositionList />
    </div>
</template>

<script>
import CapitalList from '@m/components/capitalList'
import Balance from './balance'
import PositionList from '@m/modules/positionList/positionList'
export default {
    components: {
        Balance,
        CapitalList,
        PositionList,
    },
    data () {
        return {
            capitalListData: [
                { title: '利润：', value: '1000000.00' },
                { title: '入金：', value: '1000000.00' },
                { title: '结余：', value: '1000000.00' },
            ]
        }
    },

}
</script>

<style lang="scss" scoped>

</style>
