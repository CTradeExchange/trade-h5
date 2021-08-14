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
                @open='openProductSwitch'
            />
            <van-dropdown-item
                v-model='positionTypeVal'
                :options='positionType'
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
        <!-- {{ recordList }} -->
        <div v-for='item in recordList' :key='item.orderId' class='trust-item'>
            <div class='t-header'>
                <div class='fl'>
                    <span class='name'>
                        {{ item.symbolName }}
                    </span>
                </div>
            </div><div class='direction'>
                {{ bizTypeText[item.bizType] }} /
                <span :class="Number(item.direction) === 1 ? 'riseColor' : 'fallColor'">
                    {{ Number(item.direction) === 1 ? $t('trade.buy') :$t('trade.sell') }}
                </span> {{ item.executeNum }}
            </div><div class='t-body'>
                <div class='t-left'>
                    <p class='tl-item'>
                        <label for=''>
                            挂单价
                        </label><span>
                            49.00289
                        </span>
                    </p><p class='tl-item'>
                        <label for=''>
                            {{ $t('trade.dealPrice') }}
                        </label><span class='grayColor'>
                            {{ item.executePrice }}
                        </span>
                    </p><p class='tl-item'>
                        <label for=''>
                            {{ $t('trade.stopLossPrice') }}
                        </label><span>
                            {{ item.stopLoss || '--' }}
                        </span>
                    </p>
                    <p class='tl-item'>
                        <label for=''>
                            {{ $t('trade.stopProfitPrice') }}
                        </label>
                        <span>
                            {{ item.takeProfit || '--' }}
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

                    <p class='tl-item'>
                        <label for=''>
                            {{ $t('trade.loan') }}
                        </label>
                        <span>
                            {{ item.loanAmount ? item.loanAmount + ' ' + item.outCurrency : '--' }}
                        </span>
                    </p>

                    <p class='tl-item'>
                        <span>
                            {{ formatTime(item.executeTime,'YYYY/MM/DD HH:mm:ss' ) }}
                        </span>
                    </p><p class='tl-item'>
                        <span>
                            #{{ item.orderId }}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>

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
            directionVal: '',
            positionTypeVal: '',
            timeVal: '',
            productVal: 0,
            curProduct: {},
            direction: [
                { text: t('trade.direction'), value: '' },
                { text: t('trade.buy'), value: 1 },
                { text: t('trade.sell'), value: 2 },
            ],
            positionType: [
                { text: t('trade.openClose'), value: '' },
                { text: t('trade.openPosition'), value: 1 },
                { text: t('trade.closePosition'), value: 2 },
            ],
            timeList: [
                { text: t('common.all'), value: '' },
                { text: t('common.curToday'), value: 1 },
                { text: t('common.curWeek'), value: 2 },
                { text: t('common.curMoney'), value: 3 },
                { text: t('common.curThreeMonth'), value: 4 },
            ],
            product: [
                { text: t('trade.symbol'), value: 0 },
            ],
            recordList: [],
            bizTypeText: {},
            params: {
                // executeStartTime: 0,
                // executeEndTime: 0,
            }
        })

        const account = computed(() => store.state._user.customerInfo.accountList.find(el => Number(el.tradeType) === Number(route.query.tradeType)))

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
            state.product[0].text = p.symbolName
            state.switchProductVisible = false
        }

        const queryRecordList = () => {
            const params = {
                accountId: account?.value.accountId,
                tradeType: Number(route.query.tradeType),
                sortFieldName: 'executeTime',
                sortType: 'desc',
                ...state.params
            }

            tradeRecordList(params).then(res => {
                if (res.check()) {
                    console.log('78787878', res)
                    state.recordList = res.data.list
                    state.bizTypeText = res.data.bizTypeText
                }
            }).catch(err => {
                state.loading = false
            })
        }

        const openProductSwitch = (val) => {
            productDropdown.value.toggle(false)
            state.switchProductVisible = true
        }

        // 方向筛选
        const dirdctionChange = (val) => {
            state.params.direction = val
            queryRecordList()
        }
        // 开平仓筛选
        const positionTypeChange = (val) => {
            state.params.orderType = val
        }
        // 时间筛选
        const timeChange = (timeType) => {
            if (timeType === 1) {
                state.params.executeStartTime = dayjs(new Date()).format('YYYY/MM/DD 00:00:00')
            } else if (timeType === 2) {
                state.params.executeStartTime = dayjs().startOf('week')
            } else if (timeType === 3) {
                state.params.executeStartTime = dayjs().startOf('month')
            } else if (timeType === 4) {
                state.params.executeStartTime = dayjs().subtract(3, 'month').format('YYYY/MM/DD')
            }
            queryRecordList()
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
            priceLabel
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
            display: flex;
            justify-content: space-between;
            .t-left {
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
