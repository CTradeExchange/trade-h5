<template>
    <LayoutTop :back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <van-cell-group class='group'>
            <van-cell title='阴阳烛' @click='changeType(1)'>
                <template #icon>
                    <van-icon class='icon icon_yinyangzhu' />
                </template>
                <template v-if='chartSet.chartType === 1' #right-icon>
                    <van-icon color='#58C225' name='success' />
                </template>
            </van-cell>
            <van-cell title='柱形图' @click='changeType(0)'>
                <template #icon>
                    <van-icon
                        class='icon icon_zhuxingtu'
                    />
                </template>
                <template v-if='chartSet.chartType === 0' #right-icon>
                    <van-icon color='#58C225' name='success' />
                </template>
            </van-cell>

            <van-cell title='图表线' @click='changeType(2)'>
                <template #icon>
                    <van-icon class='icon icon_tubiaoxian' />
                </template>
                <template v-if='chartSet.chartType === 2' #right-icon>
                    <van-icon color='#58C225' name='success' />
                </template>
            </van-cell>
        </van-cell-group>

        <van-cell-group class='group'>
            <!-- <van-cell title='交易量'>
                <template #right-icon>
                    <van-switch v-model='chartSet.volumeSwitch' active-color='#53C41C' size='22px' @change='handleChartSet("volumeSwitch")' />
                </template>
            </van-cell> -->
            <van-cell title='买价线'>
                <template #right-icon>
                    <van-switch v-model='chartSet.buyPriceLine' active-color='#53C41C' size='22px' @change='handleChartSet("buyPriceLine")' />
                </template>
            </van-cell>
            <van-cell title='卖价线'>
                <template #right-icon>
                    <van-switch v-model='chartSet.sellPriceLine' active-color='#53C41C' size='22px' @change='handleChartSet("sellPriceLine")' />
                </template>
            </van-cell>
            <!-- <van-cell title='周期分隔符'>
                <template #right-icon>
                    <van-switch v-model='chartSet.periodSeparator' active-color='#53C41C' size='22px' @change='handleChartSet("periodSeparator")' />
                </template>
            </van-cell>
            <van-cell title='交易级别'>
                <template #right-icon>
                    <van-switch v-model='chartSet.tradeLevel' active-color='#53C41C' size='22px' @change='handleChartSet("tradeLevel")' />
                </template>
            </van-cell>
            <p class='notice'>
                启用交易水平查看挂单价格以及图表上止损和获利的值
            </p>
            <van-cell title='高开低收'>
                <template #right-icon>
                    <van-switch v-model='chartSet.openHighCloseLow' active-color='#53C41C' size='22px' @change='handleChartSet("openHighCloseLow")' />
                </template>
            </van-cell> -->
        </van-cell-group>
    </div>
</template>

<script>
import { toRefs, reactive, onMounted, onBeforeMount } from 'vue'
import { localSet, localGet, isEmpty } from '@/utils/util'
import { deepClone } from '@utils/deepClone'
export default {
    setup (props) {
        const state = reactive({
            chartSet: {
                volumeSwitch: false,
                buyPriceLine: false,
                periodSeparator: false,
                tradeLevel: false,
                openHighCloseLow: false,
                sellPriceLine: false,
                chartType: 1
            }

        })

        const changeType = (val) => {
            state.chartSet.chartType = val
            const chartConfig = JSON.parse(localGet('chartConfig'))
            if (!isEmpty(chartConfig)) {
                chartConfig['chartType'] = val
                localSet('chartConfig', JSON.stringify(chartConfig))
            } else {
                localSet('chartConfig', JSON.stringify({ chartType: val }))
            }
        }
        const handleChartSet = (type) => {
            const chartConfig = JSON.parse(localGet('chartConfig'))

            if (!isEmpty(chartConfig)) {
                chartConfig[type] = state.chartSet[type]
                localSet('chartConfig', JSON.stringify(chartConfig))
            } else {
                localSet('chartConfig', JSON.stringify({
                    [type]: state.chartSet[type]
                }))
            }
        }
        onBeforeMount(() => {
            const chartConfig = JSON.parse(localGet('chartConfig'))
            if (!isEmpty(chartConfig)) {
                state.chartSet = deepClone(chartConfig)
            } else {
                localSet('chartConfig', JSON.stringify({ chartType: 1 }))
            }
        })

        return {
            changeType,
            handleChartSet,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    .group {
        border-top: solid rem(30px) #F6F6F6;
    }
    .notice {
        padding: rem(30px);
        background-color: var(--btnColor);
    }
    .icon {
        margin-right: rem(20px);
        color: var(--color);
        font-size: rem(46px);
        vertical-align: middle;
    }
}

</style>
