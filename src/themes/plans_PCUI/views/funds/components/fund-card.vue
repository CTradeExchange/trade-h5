<template>
    <div class='card' @click='onCard'>
        <div class='card-header'>
            <currency-icon class='currency' :currency='fund.shareTokenCode' size='42px' />
            <div class='text'>
                <span class='tag'>
                    {{ fund.fundType }}
                </span>
                <span class='name'>
                    {{ fund.shareTokenCode }}
                </span>
            </div>
            <div class='row'>
                <span class='key'>
                    {{ $t('fundInfo.realtimeJZ') }}
                </span>
                <span class='value'>
                    {{ fund.netValue }}
                </span>
            </div>
            <div class='row'>
                <span class='key'>
                    {{ $t('trade.priceLabel') }}
                </span>
                <span class='value'>
                    {{ fund.marketPrice }}
                </span>
            </div>
        </div>
        <div class='card-kline'>
            <kline-svg
                :data='klineData'
                :height='40'
                :width='360'
            />
        </div>
        <div class='card-lable'>
            <span>{{ $t('funds.label1') }}</span>
            <span>{{ $t('funds.label2') }}</span>
            <span>{{ $t('funds.label3') }}</span>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, defineProps, inject } from 'vue'
import { marketPerformance } from '@/api/trade'
import currencyIcon from '@/components/currencyIcon.vue'
import klineSvg from '@planspc/components/klineSvg.vue'

const props = defineProps({
    // 基金信息
    fund: {
        type: Object,
        default: () => {}
    }
})
const selectFund = inject('selectFund')

// 基金净值数据
const klineData = ref([])
// 随机生成基金净值数据
const randomData = () => {
    const result = []
    for (let i = 0; i < 30; i++) {
        const num = Math.floor(Math.random() * 100)
        result.push(num)
    }
    klineData.value = result
}

// 市场表现走势图
const getMarketPerformanceData = () => {
    return marketPerformance({
        fundId: props.fund.fundId,
        days: 60,
        type: 1
    }).then(res => {
        if (res.check()) {
            // const keysArr = Object.keys(res.data)
            // const key = keysArr.length > 1 ? keysArr[1] : keysArr[0]
            // const result = []
            // res.data[key].map(elem => {
            //     result.push(elem.value)
            // })
            // klineData.value = result
        }
    })
}

// 点击基金产品
const onCard = () => {
    selectFund(props.fund.fundId)
}

onMounted(() => {
    randomData()
    // getMarketPerformanceData()
})
</script>

<style lang='scss' scoped>
.card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 600px;
    height: 300px;
    padding: 58px 32px;
    margin: 16px;
    background: #fff;
    border-radius: 20px;
    box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
    transition: all .2s ease-in-out;
    cursor: pointer;
    &:hover {
        transform: scale(1.05);
    }
}
.card-header {
    display: flex;
    align-content: center;
    .currency {
        margin-right: 18px;
    }
    .text {
        flex: 1;
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        .tag {
            line-height: 18px;
            letter-spacing: .5px;
            font-size: 12px;
            color: #676767;
        }
        .name {
            line-height: 20px;
            font-size: 20px;
            font-weight: 700;
            color: #000;
        }
    }
    .row {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
        .key {
            line-height: 18px;
            font-size: 12px;
            color: #676767;
        }
        .value {
            line-height: 20px;
            font-size: 20px;
            font-weight: 700;
            color: #000;
        }
    }
}
.card-kline {
    display: flex;
    justify-content: center;
    align-items: center;
}
.card-lable {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    span {
        line-height: 20px;
        margin: 0 15px;
        font-size: 14px;
        color: #000;
    }
}
</style>
