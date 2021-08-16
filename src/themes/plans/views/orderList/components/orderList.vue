<template>
    <div class='filter-wrap'>
        <van-dropdown-menu :active-color='$style.primary' :overlay='true'>
            <van-dropdown-item
                v-model='directionVal'
                :options='direction'
                @change='dirdctionChange'
            />
            <van-dropdown-item
                ref='productDropdown'
                v-model='productVal'
                :options='product'
                @change='productChange'
            />
            <van-dropdown-item
                v-if='[1,2].indexOf(Number(tradeType)) > -1'
                v-model='positionTypeVal'
                :options='positionType'
                @change='positionTypeChange'
            />
            <van-dropdown-item
                v-if='[3,9].indexOf(Number(tradeType)) > -1'
                v-model='positionTypeVal'
                :options='priceTypeList'
                @change='positionTypeChange'
            />
            <van-dropdown-item
                v-model='timeVal'
                :options='timeList'
                @change='timeChange'
            />
        </van-dropdown-menu>
    </div>
    <div class='list-wrap'>
        <van-list
            :finished='finished'
            :finished-text='finishedText'
            :immediate-check='false'
            @load='onLoad'
        >
            <div v-for='item in recordList' :key='item.orderId' class='trust-item'>
                <div class='t-header'>
                    <div class='fl'>
                        <span class='name'>
                            {{ item.symbolName }}
                        </span>
                    </div>
                </div>
                <div class='direction'>
                    {{ bizTypeText[item.bizType] }} /
                    <span :class="Number(item.direction) === 1 ? 'riseColor' : 'fallColor'">
                        {{ Number(item.direction) === 1 ? $t('trade.buy') :$t('trade.sell') }}
                    </span> {{ item.executeNum }}
                </div>
                <div class='t-body'>
                    <div class='t-block'>
                        <p v-if='isCloseType(item.bizType)' class='tl-item'>
                            <!-- 如果是平仓 显示开仓价 -->
                            <label for=''>
                                {{ $t('trade.positionPrice') }}
                            </label><span>
                                {{ item.requestPrice || '--' }}
                            </span>
                        </p>
                        <p class='tl-item'>
                            <label for=''>
                                {{ $t('trade.dealPrice') }}
                            </label>
                            <span>
                                {{ item.executePrice }}
                            </span>
                        </p>
                        <p v-if='isCloseType(item.bizType)' class='tl-item'>
                            <label for=''>
                                {{ $t('trade.profit') }}
                            </label>
                            <span>
                                {{ item.profitLoss || '--' }}
                            </span>
                        </p>

                        <p v-if='showLossOrProfit(item)' class='tl-item'>
                            <label for=''>
                                {{ $t('trade.stopLossPrice') }}
                            </label>
                            <span>
                                {{ parseFloat(item.stopLoss) > 0 ? item.stopLoss : '--' }}
                            </span>
                        </p>
                        <p v-if='showLossOrProfit(item)' class='tl-item'>
                            <label for=''>
                                {{ $t('trade.stopProfitPrice') }}
                            </label>
                            <span>
                                {{ parseFloat(item.takeProfit) > 0 ? item.takeProfit : '--' }}
                            </span>
                        </p>

                        <p v-if='[3,9].indexOf(Number(tradeType)) > -1' class='tl-item'>
                            <label for=''>
                                {{ $t('trade.loan') }}
                            </label>
                            <span>
                                {{ item.loanAmount ? item.loanAmount + ' ' + item.outCurrency : '--' }}
                            </span>
                        </p>
                        <p v-if='isCloseType(item.bizType)' class='tl-item'>
                            <label for=''>
                                {{ $t('trade.swap') }}
                            </label>
                            <span>
                                {{ item.overnightInterest || '--' }}
                            </span>
                        </p>

                        <p class='tl-item'>
                            <label for=''>
                                {{ $t('fee') }}
                            </label>
                            <span>
                                {{ item.commission || '--' }}
                            </span>
                        </p>
                    </div>
                </div>
                <div class='t-body'>
                    <div class='t-block'>
                        <p class='tl-item'>
                            <span>
                                {{ formatTime(item.executeTime,'YYYY/MM/DD HH:mm:ss' ) }}
                            </span>
                        </p>
                        <p class='tl-item'>
                            <span>
                                #{{ item.orderId }}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </van-list>
    </div>

    <Loading :show='loading' />

    <!-- 侧边栏-切换产品 -->
    <sidebarProduct
        v-model='switchProductVisible'
        :default-trade-type='tradeType'
        :hide-trade-type='true'
        @select='onSelectProduct'
    />
</template>

<script>
import sidebarProduct from '@plans/components/sidebarProduct.vue'
import { tradeRecordList } from '@/api/user'
import { useI18n } from 'vue-i18n'
import { isEmpty } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, nextTick, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'

export default {
    components: {
        sidebarProduct
    },
    setup (props) {
        const route = useRoute()
        const store = useStore()
        const productDropdown = ref(null)
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            switchProductVisible: false,
            directionVal: -1,
            positionTypeVal: -1,
            timeVal: 0,
            productVal: 0,
            curProduct: {},
            direction: [
                { text: t('trade.direction'), value: -1 },
                { text: t('trade.buy'), value: 1 },
                { text: t('trade.sell'), value: 2 },
            ],
            positionType: [
                { text: t('trade.openClose'), value: -1 },
                { text: t('trade.openPosition'), value: 1 },
                { text: t('trade.closePosition'), value: 2 },
            ],
            timeList: [
                { text: t('common.date'), value: 0 },
                { text: t('common.curToday'), value: 1 },
                { text: t('common.curWeek'), value: 2 },
                { text: t('common.curMoney'), value: 3 },
                { text: t('common.curThreeMonth'), value: 4 },
            ],
            priceTypeList: [
                { text: t('trade.priceOrLimit'), value: -1 },
                { text: t('trade.orderTypeShort1'), value: 3 },
                { text: t('trade.orderTypeShort2'), value: 4 },
            ],
            product: [
                { text: t('common.allProduct'), value: 0 },
                { text: t('common.chooseProduct'), value: 1, },
            ],
            recordList: [],
            bizTypeText: {},
            params: {
                current: 1,
                size: 10,
                // executeStartTime: 0,
                executeEndTime: dayjs(dayjs(new Date()).format('YYYY/MM/DD 23:59:59')).valueOf()
            },
            tradeType: route.query.tradeType,
            loading: false,
            finished: false,
            finishedText: t('common.noMore'),
            loadingMore: false,

        })

        const account = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(state.tradeType)))

        // 价格标签
        const priceLabel = (bizType) => {
            if ([1, 2, 3].indexOf(Number(bizType)) > -1) {
                return t('trade.dealPrice')
            } else if ([4, 5, 6, 7, 8].indexOf(Number(bizType)) > -1) {
                return t('trade.positionPrice')
            }
        }

        // 产品选择品选择产品回调
        const onSelectProduct = (p) => {
            state.curProduct = p
            // state.product[0].text = p.symbolName
            state.switchProductVisible = false
            resetParams()
            state.params.symbolId = p.symbolId
            queryRecordList()
        }

        // 重置参数
        const resetParams = () => {
            state.params.current = 1
            state.finished = false
            state.loadingMore = true
            // state.params.symbolId = ''
            state.recordList = []
        }

        const queryRecordList = () => {
            state.loading = true
            const accountIds = []
            if (account.value.length > 0) {
                account.value.forEach(element => {
                    accountIds.push(element.accountId)
                })
            }

            const params = {
                accountIds: accountIds.toString(),
                tradeType: Number(state.tradeType),
                sortFieldName: 'executeTime',
                sortType: 'desc',
                ...state.params
            }

            tradeRecordList(params).then(res => {
                state.loading = false
                state.loadingMore = false
                if (res.check()) {
                    state.recordList = state.recordList.concat(res.data.list)
                    state.bizTypeText = res.data.bizTypeText

                    // 数据全部加载完成
                    if (state.params.current >= res.data.totalPage) {
                        state.finished = true
                        state.loadingMore = true
                        state.finishedText = t('common.noMore')
                    }
                }
            }).catch(err => {
                state.loadingMore = false
                state.loading = false
            })
        }

        // 底部加载更多
        const onLoad = () => {
            if (!state.loadingMore) {
                state.params.current++
                queryRecordList()
                state.loadingMore = true
            }
        }

        const openProductSwitch = () => {
            productDropdown.value.toggle(false)
            state.switchProductVisible = true
        }

        const productChange = (val) => {
            if (val === 0) {
                resetParams()
                delete state.params.symbolId
                queryRecordList()
            } else {
                state.switchProductVisible = true
            }
        }

        // 方向筛选
        const dirdctionChange = (val) => {
            state.params.direction = val
            resetParams()
            queryRecordList()
        }
        // 开平仓筛选
        const positionTypeChange = (val) => {
            state.params.orderType = val
            resetParams()
            queryRecordList()
        }
        // 时间筛选
        const timeChange = (timeType) => {
            if (timeType === 0) {
                state.params.executeStartTime = -1
                state.params.executeEndTime = -1
            } else if (timeType === 1) {
                state.params.executeStartTime = dayjs(dayjs(new Date()).format('YYYY/MM/DD 00:00:00')).valueOf()
            } else if (timeType === 2) {
                state.params.executeStartTime = dayjs(dayjs().startOf('week')).valueOf()
            } else if (timeType === 3) {
                state.params.executeStartTime = dayjs(dayjs().startOf('month')).valueOf()
            } else if (timeType === 4) {
                state.params.executeStartTime = dayjs(dayjs().subtract(3, 'month').format('YYYY/MM/DD')).valueOf()
            }
            resetParams()
            queryRecordList()
        }

        // 判断是否是平仓
        const isCloseType = (bizType) => {
            if ([4, 5, 6, 7, 8].indexOf(Number(bizType)) > -1) {
                return true
            } else {
                return false
            }
        }

        // 是否显示止盈止损价
        const showLossOrProfit = (item) => {
            // 玩法cfd全仓和cfd逐仓才显示止盈止损价
            if ([1, 2].indexOf(Number(state.tradeType)) > -1) {
                return true
            } else {
                return false
            }
        }

        queryRecordList()

        return {
            ...toRefs(state),
            openProductSwitch,
            productDropdown,
            onSelectProduct,
            dirdctionChange,
            positionTypeChange,
            timeChange,
            productChange,
            priceLabel,
            isCloseType,
            isEmpty,
            onLoad,
            showLossOrProfit
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.filter-wrap {
    :deep(.van-dropdown-menu) {
        background-color: var(--contentColor);
    }
}
.list-wrap {
    .trust-item {
        margin: rem(20px);
        padding: rem(20px);
        background-color: var(--contentColor);
        border-bottom: solid 1px var(--lineColor);
        border-radius: rem(8px);
        .t-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: rem(20px);
            .fl {
                margin-right: rem(32px);
                color: var(--color);
                font-size: rem(30px);
                // .time {
                //     color: var(--placeholdColor);
                //     font-size: rem(20px);
                // }
                .name {
                    margin-right: rem(40px);
                }
            }
        }
        .direction {
            margin: rem(20px) 0;
        }
        .t-body {
            //display: flex;
            //justify-content: space-between;
            .t-block {
                display: flex;
                flex-wrap: wrap;
                .tl-item {
                    width: 50%;
                    margin-bottom: rem(10px);
                    color: var(--normalColor);
                    text-align: left;
                    label {
                        display: inline-block;
                        width: rem(100px);
                        margin-right: rem(20px);
                        font-size: rem(20px);
                    }
                    span {
                        font-size: rem(20px);
                        text-align: left;
                    }
                }
            }
        }
    }
}
</style>
