<template>
    <top
        back
        :menu='false'
        :sub-title='product.symbolCode'
        :title='product.symbolName'
    />

    <div class='container'>
        <van-cell size='large' :title='$t("contract.symbolCode")' :value='product.symbolCode' />
        <van-cell size='large' :title='$t("contract.contractSize")' :value='product.contractSize' />
        <van-cell size='large' :title="$t('contract.profitCurrency')" :value='product.profitCurrency' />
        <van-cell size='large' :title="$t('contract.spread')" :value="$t('contract.float')" />
        <van-cell size='large' :title="$t('contract.singleNumbers')" :value='product.minVolume+"-"+product.maxVolume' />
        <van-cell size='large' :title="$t('contract.steper')" :value='product.volumeStep' />
        <van-cell size='large' :title="$t('contract.limitDistance')" :value='product.priceMinLimit+"/"+product.priceMaxLimit+"点"' />
        <van-cell size='large' :title="$t('contract.advance')">
            <div class='margin-info'>
                <span class='left-label header'>
                    {{ $t('contract.volumeRange') }}
                </span>
                <span class='right-val header'>
                    {{ $t('contract.margins') }}
                </span>
            </div>
            <div v-for='(item, index) in usedMarginSet' :key='index' class='margin-info'>
                <span class='left-label'>
                    {{ item.rangeLeft / product.contractSize }} &lt; {{ $t('contract.volumes') }} &le; {{ item.rangeRight / product.contractSize }}
                </span>
                <span class='right-val'>
                    {{ item.percent * 100 }}%
                </span>
            </div>
        </van-cell>
        <van-cell size='large' :title="$t('contract.feeType')" :value='$t(parseFloat(product.feeFormula)===1?"contract.ratio":"contract.amount")' />
        <van-cell size='large' :title="$t('fee')" :value='fee' />
        <van-cell size='large' :title="$t('contract.interest')" :value='interest' />
        <van-cell size='large' :title="$t('contract.zone')" :value="'GTM +' + (0 - new Date().getTimezoneOffset() / 60)" />
        <van-cell v-if='product.quoteTimeList && product.quoteTimeList.length' class='timeListCell' size='large' :title="$t('contract.quoteTime')">
            <div v-for='(item,index) in quoteTimeList' :key='index' class='item-item'>
                {{ $t('weekdayMap.'+ item[0].dayOfWeek) }}:
                <template>
                    <span v-for='el in item' :key='el.timeStr' class='timeItem'>
                        {{ el.timeStr }}
                    </span>
                </template>
            </div>
        </van-cell>
        <van-cell v-if='product.tradeTimeList && product.tradeTimeList.length' class='timeListCell' size='large' :title="$t('contract.tradeTime')">
            <div v-for='(item,index) in tradeTimeList' :key='index' class='item-item'>
                {{ $t('weekdayMap.'+ item[0].dayOfWeek) }}:
                <span v-for='el in item' :key='el.timeStr' class='timeItem'>
                    {{ el.timeStr }}
                </span>
            </div>
        </van-cell>
        <van-cell v-if='product.eodTime' size='large' :title="$t('contract.eodTime')" :value='eodTime' />
    </div>
</template>

<script>
import top from '@m/layout/top'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { isEmpty, objArraySort } from '@/utils/util'
import dayjs, { _dayjs } from 'dayjs'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useI18n } from 'vue-i18n'
import { mul } from '@/utils/calculation'
import { sortTimeList, timeListFormat } from './contractUtil'
export default {
    components: {
        top,
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const utcOffset = parseFloat(sessionStorage.getItem('utcOffset')) || dayjs().utcOffset()
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
                const newTimeList = sortTimeList(product.value.tradeTimeList, utcOffset)
                timeListFormat(newTimeList)
                return newTimeList
            }
        })
        // 行情时间
        const quoteTimeList = computed(() => {
            if (!isEmpty(product.value.quoteTimeList)) {
                const newTimeList = sortTimeList(product.value.quoteTimeList, utcOffset)
                timeListFormat(newTimeList)
                return newTimeList
            }
        })
        // 结算时间
        const eodTime = computed(() => {
            if (!isEmpty(product.value.eodTime)) {
                return dayjs().utc().startOf('day').utcOffset(utcOffset).add(product.value.eodTime, 'minute').format('HH:mm')
            }
        })

        // 年利率
        const interest = computed(() => {
            return mul(product.value.buyInterest, 100) + '%/' + mul(product.value.sellInterest, 100) + '%(' + t('contract.interestRate') + ')'
        })
        // 手续费
        const fee = computed(() => {
            return mul(product.value.fee, 100) + '%'
        })

        QuoteSocket.send_subscribe([symbolId])
        return {
            product,
            tradeTimeList,
            quoteTimeList,
            eodTime,
            interest,
            fee,
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
    .timeItem {
        &:not(:last-of-type) {
            padding-right: 5px;
            &::after {
                content: ',';
            }
        }
    }
    .timeListCell :deep(.van-cell__value) {
        flex: none;
        width: 70%;
    }
}
</style>
