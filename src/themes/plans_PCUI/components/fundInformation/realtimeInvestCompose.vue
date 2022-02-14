<template>
    <div class='realtimeInvestCompose'>
        <h4 class='title'>
            <span class='rightSwitch icon_chouti1' @click='switchAction'></span>
            {{ title || $t('fundInfo.realtimeInvestCompose') }}
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
                        {{ item.range }}
                        ( <i v-if="item.previousPeriodRangeCompare!=='-'" :class='{ "downArrow":item.previousPeriodRangeCompare<0, "upArrow":item.previousPeriodRangeCompare>0 }'></i>
                        {{ item.previousPeriodRangeCompare==='-' ? '-' : Math.abs(item.previousPeriodRangeCompare) }}
                        )
                    </p>
                    <p class='ft'>
                        <van-popover v-model:show='item.popover' placement='bottom-end' theme='dark'>
                            <p style='padding: 5px 10px; white-space: nowrap;'>
                                {{ item.weightRealValue }}({{ item.previousPeriodWeightCompare }})
                            </p>
                            <template #reference>
                                <span>
                                    {{ item.weight }}
                                    (
                                    <i v-if="item.previousPeriodWeightCompare!=='-'" :class='[item.arrow]'></i>
                                    {{ item.previousPeriodWeightCompare==='-' ? '-' : item.previousPeriodWeightCompare.replace(/[\+-]/,'') }}
                                    )
                                </span>
                            </template>
                        </van-popover>
                    </p>
                </li>
            </ul>
        </div>
        <div v-else-if="showBlock==='chart'">
            <div ref='chartPieDOM' class='chartPieDOM' :style='{ height:chartPieDOMHeight }'></div>
        </div>

        <div class='block'>
            <h4 class='singleAssetTitle'>
                {{ $t('fundInfo.singleAsset') }}
            </h4>
            <div ref='chartBarDOM' class='chartBarDOM'></div>
        </div>

        <BottomTip />
    </div>
</template>

<script setup>
import { delayAwaitTime, defineProps } from '@/utils/util'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useInvestCompose } from './hooks/realtimeInvestCompose'
import currencyIcon from '@/components/currencyIcon'
import BottomTip from './bottomTip.vue'

defineProps({
    // 标题
    title: {
        type: String,
        default: ''
    }
})

// 显示数据列表还是显示环形图
const showBlock = ref('chart')
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
        return {
            value: parseFloat(el.weight),
            name: el.asset + ' ' + el.weight,
        }
    })
})

// 饼图高度
const chartPieDOMHeight = computed(() => {
    // return 200 + 'px'
    return 200 + rangList.value.length * 18 + 'px'
})
const assetPerformanceList = ref([]) // 实时投资组合排名
const chartPieDOM = ref('')
const chartBarDOM = ref('')

const { newBarChart, newPieDoughnutChart, getInvestCombination, getAssetPerformance } = useInvestCompose()
onMounted(async () => {
    await nextTick()
    await delayAwaitTime(200)

    // 实时投资组合排名
    getInvestCombination().then(async data => {
        rangList.value = data.map(el => {
            el.popover = false
            el.arrow = parseFloat(el.previousPeriodWeightCompare) < 0 ? 'downArrow' : 'upArrow'
            return el
        })
        await nextTick()
        newPieDoughnutChart(chartPieDOM.value, chartData.value)
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
    cursor: pointer;
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
        width: rem(300px);
    }
    .small{
        font-size: rem(22px);
    }
}
.block{
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
.downArrow{
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: middle;
    border:0 solid transparent;
    border-radius: 3px;
    border-width: 5px 5px 0 5px;
    border-top-color: var(--fallColor);
}
.upArrow{
    @extend .downArrow;
    border-width: 0 5px 5px 5px;
    border-top-color: transparent;
    border-bottom-color: var(--riseColor);
}
</style>
