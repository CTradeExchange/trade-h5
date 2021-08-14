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
        {{ recordList }}
        <div v-for='item in recordList' :key='item.orderId' class='trust-item'>
            <div class='t-header'>
                <div class='fl'>
                    <span class='name'>
                        {{ item.symbolName }}
                    </span>
                </div>
            </div><div class='direction'>
                限价开仓 /
                <span class='fallColor'>
                    卖出
                </span> 0.01
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
                            成交价
                        </label><span class='grayColor'>
                            49.00089
                        </span>
                    </p><p class='tl-item'>
                        <label for=''>
                            止损价
                        </label><span>
                            0
                        </span>
                    </p>
                    <p class='tl-item'>
                        <label for=''>
                            止盈
                        </label>
                        <span>
                            0
                        </span>
                    </p>
                    <p class='tl-item'>
                        <span>
                            2021/08/11 08:59:29
                        </span>
                    </p><p class='tl-item'>
                        <span>
                            #1425441744087977984
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- 侧边栏-切换产品 -->
    <sidebarProduct
        v-model='switchProductVisible'
        :trade-type='tradeType'
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
const mockResult = {
    'bizCode': '',
    'code': '0',
    'msg': '成功',
    'tm': 0,
    'trace': null,
    'msgParams': null,
    'data': {
        'companyId': 16,
        'customerId': 2462,
        'customerNo': '86002461',
        'accountId': 5017,
        'trace': null,
        'ip': null,
        'size': 20,
        'current': 1,
        'totalPage': 1,
        'list': [
            {
                'orderId': 20229,
                'bizType': 1,
                'symbolName': 'BTC/USDT-TEST',
                'direction': 2,
                'requestPrice': '0.0',
                'executePrice': '37021.6',
                'executeNum': '0.01000000',
                'loanAmount': '0.000000',
                'executeTime': 1628662432860,
                'outCurrency': null,
                'stopLoss': null,
                'takeProfit': null,
                'commission': '0.000000',
                'profitLoss': null,
                'overnightInterest': null
            },
            {
                'orderId': 20228,
                'bizType': 1,
                'symbolName': 'BTC/USDT-TEST',
                'direction': 2,
                'requestPrice': null,
                'executePrice': '370216',
                'executeNum': '0.01000000',
                'loanAmount': '0',
                'executeTime': 1628662432619,
                'outCurrency': null,
                'stopLoss': null,
                'takeProfit': null,
                'commission': '0',
                'profitLoss': null,
                'overnightInterest': null
            },
            {
                'orderId': 20227,
                'bizType': 1,
                'symbolName': 'BTC/USDT-TEST',
                'direction': 2,
                'requestPrice': '0.0',
                'executePrice': '37021.6',
                'executeNum': '0.01000000',
                'loanAmount': '0.000000',
                'executeTime': 1628662432140,
                'outCurrency': null,
                'stopLoss': null,
                'takeProfit': null,
                'commission': '0.000000',
                'profitLoss': null,
                'overnightInterest': null
            }
        ],
        'bizTypeText': {
            '1': '市价开仓',
            '2': '限价开仓',
            '3': '停损开仓',
            '4': '市价平仓',
            '5': '止盈平仓',
            '6': '止损平仓',
            '7': '系统平仓',
            '8': '到期平仓'
        }
    },
    'fail': false,
    'ok': true
}
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
            directionVal: 0,
            positionTypeVal: 0,
            timeVal: 0,
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
                { text: t('common.all'), value: 0 },
                { text: t('common.curToday'), value: 1 },
                { text: t('common.curWeek'), value: 2 },
                { text: t('common.curMoney'), value: 3 },
                { text: t('common.curThreeMonth'), value: 4 },
            ],
            product: [
                { text: t('trade.symbol'), value: 0 },
            ],
            recordList: mockResult.data.list,
            bizTypeText: mockResult.data.bizTypeText
        })

        const account = computed(() => store.state._user.customerInfo.accountList.find(el => Number(el.tradeType) === Number(route.query.tradeType)))

        // 产品选择品选择产品回调
        const onSelectProduct = (p) => {
            state.curProduct = p
            state.product[0].text = p.symbolName
            state.switchProductVisible = false
        }

        const queryRecordList = () => {
            const params = {
                accountId: account?.value.accountId,
                tradeType: route.query.tradeType,
                sortFieldName: 'executeTime',
                sortType: 'desc'
            }
            tradeRecordList(params).then(res => {
                if (res.check()) {
                    console.log('78787878', res)
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
        const dirdctionChange = () => {}
        // 开平仓筛选
        const positionTypeChange = () => {}
        // 时间筛选
        const timeChange = () => {}

        queryRecordList()

        return {
            ...toRefs(state),
            openProductSwitch,
            productDropdown,
            onSelectProduct,
            dirdctionChange,
            positionTypeChange,
            timeChange
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
