<template>
    <div>
        <div class='more-tabs'>
            <div class='box' :class="{ 'active': showBlock === 'list' }">
                <img class='icon icon1' :src="require('@public/images/chart-icon1.png')" @click="switchAction('list')" />
            </div>
            <div class='box' :class="{ 'active': showBlock === 'chart' }">
                <img class='icon icon2' :src="require('@public/images/chart-icon2.png')" @click="switchAction('chart')" />
            </div>
        </div>
        <div class='merge-case'>
            <div v-if="showBlock === 'list'" class='case-list'>
                <div class='assetsTitle cellflex'>
                    <p class='hd'>
                        {{ $t('fundInfo.assets') }}
                    </p>
                    <p class='bd'>
                        {{ $t('fundInfo.ranking') }}
                        <br v-if='symbolId' />
                        <span class='small'>
                            ({{ symbolId ? $t('fundInfo.comparePrev') : '24H' }})
                        </span>
                    </p>
                    <p class='ft'>
                        {{ $t('fundInfo.weight') }}
                        <br v-if='symbolId' />
                        <span class='small'>
                            ({{ symbolId ? $t('fundInfo.comparePrev') : '24H' }})
                        </span>
                    </p>
                </div>
                <ul class='assetsList'>
                    <li v-for='item in rangList' :key='item.asset' class='cellflex'>
                        <p class='hd'>
                            <currency-icon :currency='item.asset' :size='24' />
                            <span class='name'>
                                {{ item.asset }}
                            </span>
                        </p>
                        <p class='bd'>
                            {{ item.range }}
                            ( <i v-if="item.previousPeriodRangeCompare!=='-'" :class='{ "downArrow":item.previousPeriodRangeCompare < 0, "upArrow":item.previousPeriodRangeCompare > 0 }'></i>
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
            <div v-else id='chartDom' ref='chartDom' class='chartDom' :style='{ height: chartPieDOMHeight }'></div>
        </div>
    </div>
</template>

<script setup>
import currencyIcon from '@/components/currencyIcon'
import { useChart } from '../hooks.js'
import { onMounted, ref, computed, nextTick, defineProps } from 'vue'
const props = defineProps({
    // 基金id
    fundId: {
        fundId: String,
        default: ''
    }
})

const chartDom = ref(null)
const { getInvestCombination, newPieDoughnutChart } = useChart({ fundId: props.fundId })
// 实时投资组合排名列表
const rangList = ref([])
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
    return 200 + rangList.value.length * 18 + 'px'
})

// 显示数据列表还是显示环形图
const showBlock = ref('list')
// 切换数据列表和环形图的显示
const switchAction = async (value) => {
    showBlock.value = showBlock.value === 'list' ? 'chart' : 'list'
    if (showBlock.value === 'chart') {
        await nextTick()
        if (chartDom.value) {
            newPieDoughnutChart(chartDom.value, chartData.value)
        }
    }
}

onMounted(() => {
    // 实时投资组合排名
    getInvestCombination().then(data => {
        rangList.value = data.map(el => {
            el.popover = false
            el.arrow = parseFloat(el.previousPeriodWeightCompare) < 0 ? 'downArrow' : 'upArrow'
            return el
        })
    })
})
</script>

<style scoped lang="scss">
.chartDom {
    height: 300px;
}
.more-tabs {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
    .box {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 42px;
        height: 42px;
        margin-left: 10px;
        border-radius: 5px;
        transform: scale(.9);
        cursor: pointer;
        &.active {
            background: var(--lineColor);
        }
        &:hover {
            background: var(--lineColor);
        }
    }
    .icon {
        &.icon1 {
            width: 36px;
            height: 36px;
        }
        &.icon2 {
            width: 28px;
            height: 28px;
        }
    }
}
.assetsList{
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 14px;
    li{
        margin-bottom: 10px;
        .ft {
            cursor: pointer;
        }
    }
}
.cellflex {
    display: flex;
    align-items: center;
    text-align: right;
    .hd {
        display: inline-flex;
        align-items: center;
        text-align: left;
        flex: 1;
        .name {
            line-height: 1;
            margin-left: 10px;
            font-size: 14px;
            font-weight: 700;
            color: #333;
        }
    }
    .ft {
        width: 150px;
    }
    .small{
        font-size: 12px;
    }
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
