<template>
    <div class='contractWrapper'>
        <top
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
            <van-cell v-if='usedMarginSet && usedMarginSet.length' size='large' :title="$t('contract.advance')">
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
                        {{ item.rangeLeftVolume }} &lt; {{ $t('contract.volumes') }} &le; {{ item.rangeRightVolume }}
                    </span>
                    <span class='right-val'>
                        {{ item.percent * 100 }}%
                    </span>
                </div>
                <div class='margin-info'>
                    <span class='left-label'>
                        {{ $t('contract.volumes') }} &gt; {{ usedMarginSet[usedMarginSet.length-1].rangeRightVolume }}
                    </span>
                    <span class='right-val'>
                        {{ usedMarginSet[usedMarginSet.length-1].percent * 100 }}%
                    </span>
                </div>
            </van-cell>
            <van-cell size='large' :title="$t('contract.feeType')" :value='$t(parseFloat(product.feeFormula)===1?"contract.ratio":"contract.amount")' />
            <van-cell size='large' :title="$t('fee')" :value='fee' />
            <van-cell size='large' :title="$t('contract.interest')" :value='interest' />
            <van-cell size='large' :title="$t('contract.zone')" :value="'GMT +' + (0 - new Date().getTimezoneOffset() / 60)" />
            <van-cell v-if='quoteTimeList && quoteTimeList.length' class='timeListCell' size='large' :title="$t('contract.quoteTime')">
                <template v-for='(item,index) in quoteTimeList' :key='index'>
                    <div v-if='item.length' class='item-item'>
                        {{ $t('weekdayMap.'+ item[0].dayOfWeek) }}:
                        <template>
                            <span v-for='el in item' :key='el.timeStr' class='timeItem'>
                                {{ el.timeStr }}
                            </span>
                        </template>
                    </div>
                </template>
            </van-cell>
            <van-cell v-if='tradeTimeList && tradeTimeList.length' class='timeListCell' size='large' :title="$t('contract.tradeTime')">
                <template v-for='(item,index) in tradeTimeList' :key='index'>
                    <div v-if='item.length' class='item-item'>
                        {{ $t('weekdayMap.'+ item[0].dayOfWeek) }}:
                        <span v-for='el in item' :key='el.timeStr' class='timeItem'>
                            {{ el.timeStr }}
                        </span>
                    </div>
                </template>
            </van-cell>
            <van-cell v-if='product.eodTime' size='large' :title="$t('contract.eodTime')" :value='eodTime' />
            <van-cell v-if='expireTime' size='large' :title='$t("contract.expireTime")' :value='expireTime' />
        </div>
    </div>
</template>

<script>
import top from '@c/layout/top'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isEmpty, objArraySort } from '@/utils/util'
import dayjs, { _dayjs } from 'dayjs'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useI18n } from 'vue-i18n'
import { mul } from '@/utils/calculation'
import { sortTimeList, timeListFormat } from './contractUtil'
import BigNumber from 'bignumber.js'
export default {
    components: {
        top,
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const utcOffset = parseFloat(sessionStorage.getItem('utcOffset')) || dayjs().utcOffset()
        const symbolId = route.query.symbolId
        const product = computed(() => store.state._quote.productMap[symbolId])
        if (product.value) store.dispatch('_quote/querySymbolInfo', symbolId)
        else router.replace('/')
        const usedMarginSet = computed(() => {
            if (!isEmpty(product.value.usedMarginSet)) {
                const contractSize = product.value.contractSize
                return objArraySort(product.value.usedMarginSet, 'rangeLeft').map(el => {
                    el.rangeLeftVolume = BigNumber(el.rangeLeft).div(contractSize).toNumber()
                    el.rangeRightVolume = BigNumber(el.rangeRight).div(contractSize).toNumber()
                    return el
                })
            }
        })
        // 交易时间
        const tradeTimeList = computed(() => {
            if (!isEmpty(product.value.tradeTimeList)) {
                const newTimeList = sortTimeList(product.value.tradeTimeList, utcOffset)
                timeListFormat(newTimeList)
                return newTimeList
            }
            return []
        })
        // 行情时间
        const quoteTimeList = computed(() => {
            if (!isEmpty(product.value.quoteTimeList)) {
                const newTimeList = sortTimeList(product.value.quoteTimeList, utcOffset)
                timeListFormat(newTimeList)
                return newTimeList
            }
            return []
        })
        // 结算时间
        const eodTime = computed(() => {
            if (!isEmpty(product.value.eodTime)) {
                return dayjs().utc().startOf('day').utcOffset(utcOffset).add(product.value.eodTime, 'minute').format('HH:mm')
            }
            return ''
        })

        // 年利率
        const interest = computed(() => {
            return mul(product.value.buyInterest, 100) + '%/' + mul(product.value.sellInterest, 100) + '%(' + t('contract.interestRate') + ')'
        })
        // 手续费
        const fee = computed(() => {
            return parseFloat(product.value.feeFormula) === 1 ? mul(product.value.feeRate, 100) + '%' : product.value.fee
        })
        // 手续费
        const expireTime = computed(() => {
            if (product.value.endTime === 9999999999999) return null
            return dayjs(product.value.endTime).format('YYYY-MM-DD HH:mm:ss')
        })

        QuoteSocket.send_subscribe([symbolId])
        return {
            product,
            tradeTimeList,
            quoteTimeList,
            eodTime,
            interest,
            fee,
            expireTime,
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
    background-color: var(--bgColor);
    :deep(.van-cell) {
        background-color: var(--bgColor);
        .van-cell__title {
            color: var(--normalColor);
        }
        .van-cell__value {
            color: var(--color);
        }
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
}
</style>
