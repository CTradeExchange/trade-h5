<template>
    <div class='realtimeInvestCompose'>
        <h4 class='title'>
            <span class='rightSwitch icon_chouti1' @click='switchAction'></span>
            {{ $t('fundInfo.realtimeInvestCompose') }}
        </h4>
        <div v-if="showBlock==='list'">
            <div class='assetsTitle cellflex'>
                <p class='hd'>
                    {{ $t('fundInfo.assets') }}
                </p>
                <p class='bd'>
                    {{ $t('fundInfo.ranking') }}
                    <br />
                    <span class='small'>
                        ({{ $t('fundInfo.comparePrev') }})
                    </span>
                </p>
                <p class='ft'>
                    {{ $t('fundInfo.weight') }}
                    <br />
                    <span class='small'>
                        ({{ $t('fundInfo.comparePrev') }})
                    </span>
                </p>
            </div>
            <ul class='assetsList'>
                <li v-for='item in rangList' :key='item.asset' class='cellflex'>
                    <p class='hd'>
                        <!-- <i class='currencyIcon'></i> -->
                        <currency-icon :currency='item.asset' />
                        {{ item.asset }}
                    </p>
                    <p class='bd'>
                        {{ item.range }}({{ item.previousPeriodRangeCompare }})
                    </p>
                    <p class='ft'>
                        <van-popover v-model:show='item.popover' theme='dark'>
                            <p style='padding: 5px 10px; white-space: nowrap;'>
                                {{ item.weightDot }}({{ item.previousPeriodWeightCompare }})
                            </p>
                            <template #reference>
                                <span>{{ item.weight }}({{ item.previousPeriodWeightCompare }})</span>
                            </template>
                        </van-popover>
                    </p>
                </li>
            </ul>
        </div>
        <div v-else-if="showBlock==='chart'">
            <div ref='chartPieDOM' class='chartPieDOM'></div>
        </div>

        <div class='block'>
            <h4 class='singleAssetTitle'>
                {{ $t('fundInfo.singleAsset') }}
            </h4>
            <div ref='chartBarDOM' class='chartBarDOM'></div>
        </div>
    </div>
</template>

<script setup>
import { delayAwaitTime } from '@/utils/util'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useInvestCompose } from './hooks/realtimeInvestCompose'
import currencyIcon from '@/components/currencyIcon'

// 显示数据列表还是显示环形图
const showBlock = ref('list')
// 切换数据列表和环形图的显示
const switchAction = async () => {
    showBlock.value = showBlock.value === 'list' ? 'chart' : 'list'
    if (showBlock.value === 'chart') {
        await nextTick()
        newPieDoughnutChart(chartPieDOM.value, chartData.value)
    }
}

const rangList = ref([]) // 实时投资组合排名列表
const chartData = computed(() => {
    return rangList.value.map(el => {
        return { value: parseFloat(el.weight), name: el.asset + ' ' + el.weight }
    })
})
const assetPerformanceList = ref([]) // 实时投资组合排名
const chartPieDOM = ref('')
const chartBarDOM = ref('')

const { newBarChart, newPieDoughnutChart, getInvestCombination, getAssetPerformance } = useInvestCompose()
onMounted(async () => {
    await nextTick()
    await delayAwaitTime(200)

    // 实时投资组合排名
    getInvestCombination().then(data => {
        rangList.value = data.map(el => {
            el.popover = false
            el.weightDot = '123.123456789%'
            return el
        })
    })

    // 单资产表现柱状图
    getAssetPerformance().then(data => {
        const chartXData = []
        const chartYData = []
        data.forEach(el => {
            chartYData.push({
                value: el.quoteChange,
                itemStyle: {
                    color: el.quoteChange < 0 ? '#a90000' : '#2b70ae'
                }
            })
            chartXData.push(el.xAxisName)
        })
        assetPerformanceList.value = data
        newBarChart(chartBarDOM.value, [chartXData, chartYData])
    })
})
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.title{
    font-size: rem(32px);
}
.rightSwitch{
    float: right;
    font-size: rem(28px);
    line-height: 1.5;
}
.assetsTitle{
    margin-top: rem(30px);
    color: var(--minorColor);
    font-size: rem(24px);
}
.assetsList{
    margin-top: rem(20px);
    font-size: rem(28px);
    li{
        line-height: rem(60px);
    }

}
.cellflex{
    display: flex;
    text-align: right;
    .hd{
        text-align: left;
    }
    .bd{
        flex: 1;
    }
    .ft{
        width: rem(240px);
    }
    .small{
        font-size: rem(22px);
    }
}
.block{
    margin-top: rem(40px);
    border-top: 6px solid var(--bgColor);
}
.chartPieDOM{
    height: rem(400px);
}
.singleAssetTitle{
    padding: rem(30px) 0;
    font-size: rem(32px);
}
.chartBarDOM{
    height: rem(500px);
}
</style>
