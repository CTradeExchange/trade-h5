<template>
    <top
        back
        :menu='false'
        :sub-title='product.symbolCode'
        :title='product.symbolName'
    />

    <div class='container'>
        <van-cell size='large' title='产品代码' :value='product.symbolCode' />
        <van-cell size='large' title='合约大小' :value='product.contractSize' />
        <van-cell size='large' title='收益货币' :value='product.profitCurrency' />
        <van-cell size='large' title='点差' value='浮动' />
        <van-cell size='large' title='单笔交易手数' :value='product.minVolume+"-"+product.maxVolume' />
        <van-cell size='large' title='手数步长' :value='product.volumeStep' />
        <!-- <van-cell size='large' title='小数位' :value='product.price_digits' /> -->
        <van-cell size='large' title='最小/最大挂单距离' :value='product.priceMinLimit+"/"+product.priceMaxLimit+"点"' />
        <van-cell size='large' title='预付款'>
            <div class='margin-info'>
                <span class='left-label header'>
                    手数范围
                </span>
                <span class='right-val header'>
                    保证金要求
                </span>
            </div>
            <div v-for='(item, index) in usedMarginSet' :key='index' class='margin-info'>
                <span class='left-label'>
                    {{ item.rangeLeft / product.contractSize }} &lt; 手数 &le; {{ item.rangeRight / product.contractSize }}
                </span>
                <span class='right-val'>
                    {{ item.percent * 100 }}%
                </span>
            </div>
        </van-cell>
        <van-cell size='large' title='手续费类型' :value='product.feeFormula===1? "百分比":"金额"' />
        <van-cell size='large' title='手续费' :value='product.fee' />
        <van-cell size='large' title='库存费(买/卖)' :value='product.buyInterest +"%/"+ product.sellInterest+"%(年利率)"' />
        <van-cell size='large' title='所在时区' :value="'UTC+' + (0 - new Date().getTimezoneOffset() / 60)" />
        <!-- <van-cell size='large' title='止损水平' :value='product.stopLossMinPoint +"-"+ product.stopLossMaxPoint' /> -->
        <!-- <van-cell size='large' title='利润计算公式' value='Forex' /> -->
        <!-- <van-cell size='large' title='预付款金计算公式' :value="Number(product.marginType) === 1 ? 'Forex': 'CFD'" /> -->
        <!-- <van-cell size='large' title='预付款对冲' value='单边较大值' /> -->
        <!-- <van-cell size='large' title='挂单有效期' value='当日/当周' /> -->
        <!-- <van-cell size='large' title='库存费类型' value='百分比' /> -->
        <!-- <van-cell size='large' title='买入库存费' :value='product.buyInterest' /> -->
        <!-- <van-cell size='large' title='卖出库存费' :value='product.sellInterest' /> -->
        <van-cell v-if='product.quoteTimeList && product.quoteTimeList.length' size='large' title='行情时间'>
            <div v-for='(item,index) in quoteTimeList' :key='index' class='item-item'>
                {{ weekdayMap[item.dayOfWeek] }}: {{ formatDayTime(item.startTime, item.endTime) }}
            </div>
        </van-cell>
        <van-cell size='large' title='交易时间'>
            <div v-for='(item,index) in tradeTimeList' :key='index' class='item-item'>
                {{ weekdayMap[item.dayOfWeek] }}: {{ formatDayTime(item.startTime, item.endTime) }}
            </div>
        </van-cell>
        <van-cell v-if='product.eodTime' size='large' title='结算时间' :value='eodTime' />
    </div>
</template>

<script>
import top from '@m/layout/top'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { isEmpty, objArraySort } from '@/utils/util'
import dayjs from 'dayjs'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
    components: {
        top,
    },
    setup () {
        const store = useStore()
        const route = useRoute()

        const weekdayMap = {
            1: '周一',
            2: '周二',
            3: '周三',
            4: '周四',
            5: '周五',
            6: '周六',
            7: '周日'
        }

        const symbolId = route.query.symbolId
        store.dispatch('_quote/querySymbolInfo', symbolId)
        const product = computed(() => store.state._quote.productMap[symbolId])
        console.log('product', product)
        const usedMarginSet = computed(() => {
            if (!isEmpty(product.value.usedMarginSet)) {
                return objArraySort(product.value.usedMarginSet, 'rangeLeft')
            }
        })
        // 交易时间
        const tradeTimeList = computed(() => {
            if (!isEmpty(product.value.tradeTimeList)) {
                return objArraySort(product.value.tradeTimeList, 'dayOfWeek')
            }
        })
        // 行情时间
        const quoteTimeList = computed(() => {
            if (!isEmpty(product.value.quoteTimeList)) {
                return objArraySort(product.value.quoteTimeList, 'dayOfWeek')
            }
        })

        const formatDayTime = (startTime, endTime) => {
            if (!isEmpty(startTime) && !isEmpty(endTime)) {
                const startTimeStr = dayjs().startOf('day').add(startTime, 'minute').format('HH:mm')
                const endTimeStr = dayjs().startOf('day').add(endTime, 'minute').format('HH:mm')
                if (endTime === Number(1440)) {
                    return startTimeStr + '-' + '24:00'
                } else {
                    return startTimeStr + '-' + endTimeStr
                }
            }
        }
        // 结算时间
        const eodTime = computed(() => {
            if (!isEmpty(product.value.eodTime)) {
                return dayjs().startOf('day').add(product.value.eodTime, 'minute').format('HH:mm')
            }
        })

        QuoteSocket.send_subscribe([symbolId])
        return {
            product,
            weekdayMap,
            formatDayTime,
            tradeTimeList,
            quoteTimeList,
            eodTime,
            usedMarginSet
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.container {
    flex: 1;
    overflow-y: auto;
    .margin-info {
        text-align: left;
        .left-label {
            display: inline-block;
            width: rem(190px);
            margin-right: rem(10px);
            text-align: right;
            &.header {
                text-align: center;
            }
        }
        .right-val {
            display: inline-block;
            width: rem(140px);
            text-align: center;
            &.header {
                text-align: center;
            }
        }
    }
}
</style>
