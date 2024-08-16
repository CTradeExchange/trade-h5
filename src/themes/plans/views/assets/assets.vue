<template>
    <div class='assetsWrapper'>
        <div class='header'>
            <div class='title'>
                {{ $t('route.assets') }}
            </div>
            <img alt='' class='connect-icon' src='@/themeCommon/image/connect.png' @click='visitHelp' />
        </div>
        <div :class="isTop ? 'isShow' : 'assetsCard'">
            <HeaderCard @callback='headerCallback' @show='showAmout = $event' />
        </div>
        <div class='spacing-space'></div>
        <div class='assetsContent'>
            <div class='content w-full'>
                <AssetsInfo :show-amout='showAmout' />
                <van-empty v-if='positionList?.[2]?.length === 0' image='/images/empty.png' :image-size='100'>
                    <div class='flex flex-col justify-center'>
                        <div class='text-center font-bold text-base'>
                            {{ $t('trade.noPositions') }}
                        </div>
                        <div class='text-sm text-minorColor text-center mb-4  mt-1'>
                            {{ $t('register.goDepositStartTrading') }}
                        </div>
                        <van-button size='small' type='primary' @click='goOrder'>
                            {{ $t('common.startTrade') }}
                        </van-button>
                    </div>
                </van-empty>
                <div v-show='positionList?.[2]?.length'>
                    <PositionList />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted, getCurrentInstance } from 'vue'
import { computed, watch } from '@vue/runtime-core'
import { isEmpty, localGet, addThousandthSign } from '@/utils/util'
import { QuoteSocket, MsgSocket } from '@/plugins/socket/socket'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import activeWallet from '../../images/assets/activeWallet.svg'
import wallet from '../../images/assets/wallet.svg'
import activeFavoritechart from '../../images/assets/activeFavoritechart.svg'
import favoritechart from '../../images/assets/favoritechart.svg'

import AssetsInfo from './components/assetsInfo.vue'
import HeaderCard from './components/headerCard.vue'
import PositionList from '@plans/modules/positionList/positionList'
import router from '../../router'
import { useAssets } from '@/hooks/assets'

export default {
    components: {
        PositionList,
        HeaderCard,
        AssetsInfo,
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const assetsSwipe = ref(null)
        const curIndex = ref(0)
        const hideAsset = ref(JSON.parse(localGet('hideAsset')))
        const tradeSearchMap = ref({})
        const state = reactive({
            duration: 0,
            alreadySub: false,
            activeId: route.query?.activeId || 0,
            cloudWalletValuation: '',
            tradingAccountBalance: '',
            isTop: false, // 是否吸顶
            showAmout: true,
        })

        // 获取账户列表
        const accountList = computed(() => {
            const list =
                store.state._user?.customerInfo?.accountList &&
                store.state._user?.customerInfo?.accountList.filter((item) => Number(item.tradeType) === Number(tradeType.value))
            const searchText = tradeSearchMap.value[tradeType.value] || ''
            if (hideAsset.value) {
                if (Number(tradeType.value) === 3) {
                    return list.filter(
                        (item) =>
                            (item.balance > 0 || item.liabilitiesPrincipal > 0) &&
                            item.currency.toUpperCase().includes(searchText.toUpperCase()),
                    )
                } else if (Number(tradeType.value) === 5) {
                    return list.filter((item) => item.balance > 0 && item.currency.toUpperCase().includes(searchText.toUpperCase()))
                }
            }
            return list.filter((item) => item.currency.toUpperCase().includes(searchText.toUpperCase())) || []
        })
        // 获取玩法列表
        const plans = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            const resultPlans = store.state._base.plans
                .filter((e) => {
                    return userProductCategory[e.tradeType]?.find((o) => o.listByUser?.length)
                })
                .map((el) => {
                    el.name = t('tradeType.' + el.tradeType)
                    return el
                })
            return resultPlans
        })
        const customerInfo = computed(() => store.state._user.customerInfo)
        const symbolKey = computed(() => store.state._quote.productActivedID)
        const tradeType = computed(() => store.state._base.tradeType)

        // 持仓列表数据
        const positionList = computed(() => store.state._trade.positionList)

        // 获取当前 tab 下标
        const tabIndex = computed(() =>
            plans.value.findIndex((item) => {
                return Number(item?.id) === Number(tradeType.value)
            }),
        )

        // 总初始保证金+盈亏+可用保证金余额兑换成美金的价值
        const userAccount = useAssets()

        // 路由变化取消订阅
        watch(
            () => route.path,
            (newVal) => {
                if (newVal !== '/assets') {
                    MsgSocket.cancelSubscribeAsset()
                }
            },
        )

        // 获取持仓列表
        const queryPositionList = (tradeType) => {
            if (isEmpty(customerInfo.value)) {
                return
            }
            const accountId = customerInfo.value.accountList.find((item) => Number(item.tradeType) === Number(tradeType))?.accountId
            store
                .dispatch('_trade/queryPositionPage', {
                    tradeType: tradeType,
                    sortFieldName: 'openTime',
                    sortType: 'desc',
                    accountId,
                })
                .then((res) => {
                    if (res.check()) {
                        if (!state.alreadySub) {
                            sendSubscribe(res.data)
                        }
                    }
                })
                .catch(() => {})
                .finally(() => {
                    // 订阅资产数据
                    MsgSocket.subscribeAsset(tradeType)
                })
        }

        const sendSubscribe = (data) => {
            if (data.length > 0) {
                const subscribList = data.map((el) => {
                    return {
                        symbolId: el.symbolId,
                        tradeType: el.tradeType,
                    }
                })
                QuoteSocket.send_subscribe(subscribList)
            }
        }

        const initData = () => {
            if ([1, 2].indexOf(Number(tradeType.value)) > -1) {
                queryPositionList(tradeType.value)
            } else if ([3, 5, 9].indexOf(Number(tradeType.value)) > -1) {
                store.dispatch('_user/queryCustomerAssetsInfo', {
                    tradeType: tradeType.value,
                })
            }
        }
        const headerCallback = (val) => {
            state.cloudWalletValuation = val.cloudWalletValuation
            state.tradingAccountBalance = val.tradingAccountBalance
        }

        // 隐藏0资产事件
        const changeState = (val) => {
            hideAsset.value = val
        }

        // 获取字体大小
        const getTotalFontSize = (text) => {
            const length = String(text).length
            if (length > 14) {
                return 'amountScale'
            }
            return 'amount'
        }

        // 搜索资产
        const searchAsset = (val) => {
            tradeSearchMap.value[tradeType.value] = val
        }
        // 跳转到交易界面
        const goOrder = () => {
            const [symbolId, tradeType] = symbolKey.value?.split('_') || []
            const href = `/order?symbolId=${symbolId || ''}&tradeType=${tradeType || ''}`
            router.push(href)
        }

        const handleTouchMove = () => {
            state.isTop = !state.isTop
        }

        const changeTab = (index) => {
            router.replace({ name: 'Assets', query: { activeId: index } })
            state.activeId = index
        }

        onMounted(() => {
            const index = tabIndex.value === -1 ? 0 : tabIndex.value
            assetsSwipe.value && assetsSwipe.value.swipeTo(index)
            store.commit('_quote/Update_tradeType', 1)
            initData()
            // 每次切换资产页面拉取用户信息 --- 记录小问题（首次刷新时导致与main文件两次调用）
            store.dispatch('_user/findCustomerInfo', false)
        })

        const { proxy } = getCurrentInstance()

        const visitHelp = () => {
            proxy.openPasstoAIChat()
        }

        return {
            visitHelp,
            headerCallback,
            accountList,
            curIndex,
            assetsSwipe,
            tradeType,
            plans,
            changeState,
            searchAsset,
            hideAsset,
            activeWallet,
            wallet,
            activeFavoritechart,
            favoritechart,
            positionList,
            goOrder,
            handleTouchMove,
            addThousandthSign,
            getTotalFontSize,
            changeTab,
            ...toRefs(state),
            userAccount,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.assetsWrapper {
    padding-bottom: rem(136px);
    .header {
        width: 100%;
        height: rem(110px);
        background: var(--contentColor);
        color: var(--mainColor);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 rem(30px);
        font-weight: 600;
        .title {
            font-size: rem(44px);
        }
        .connect-icon {
            max-width: 36px;
        }
    }
    height: 100%;
    display: flex;
    flex-direction: column;
    .assetsHeader {
        flex-shrink: 0;
        position: sticky;
        top: 0;
    }
    .assetsCard {
        height: auto;
    }
    .isShow {
        height: 0;
        margin-bottom: 0;
    }
    .spacing-space {
        width: 100%;
        height: 8px;
        background: var(--fafColor);
    }
    .assetsContent {
        flex: 1;
        height: 100%;
        z-index: 9;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        background: var(--contentColor);
        transition: 0.5s;
        .iconBtn {
            width: 100%;
            padding: rem(16px) 0;
            display: flex;
            align-items: center;
            justify-content: center;
            .icon {
                width: rem(80px);
                height: rem(4px);
                border-radius: 2px;
                background: #888686;
            }
        }

        .tabs {
            flex-shrink: 0;
            width: 100%;
            padding: 0 rem(30px);
            display: flex;
            align-items: center;
            justify-content: space-between;
            .btn {
                min-width: rem(328px);
                min-height: rem(116px);
                display: flex;
                padding: rem(16px) rem(16px) rem(20px) rem(16px);
                border-radius: rem(16px);
                color: var(--minorColor);

                img {
                    margin-top: rem(16px);
                    width: rem(48px);
                    height: rem(48px);
                }
                .textBox {
                    margin-left: rem(16px);
                    display: flex;
                    flex-direction: column;
                    font-family: Inter;

                    .title {
                        font-size: rem(22px);
                        color: var(--minorColor);
                    }
                    .amount {
                        max-width: rem(230px);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        margin-top: 8px;
                        font-size: 16px;
                        font-weight: 700;
                        line-height: 16px;
                    }
                    .amountScale {
                        max-width: rem(230px);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        margin-top: rem(16px);
                        font-size: rem(23px);
                        font-weight: 700;
                        line-height: rem(32px);
                    }
                }
            }
            .activeBtn {
                background-color: var(--transferSuccessBg);
                color: var(--mainColor) !important;
                position: relative;
                &::after {
                    content: '';
                    width: rem(4px);
                    height: rem(32px);
                    border-radius: rem(2px);
                    position: absolute;
                    top: rem(42px);
                    left: 0;
                    background-color: var(--primary);
                }
            }
        }
        .content {
            flex: 1;
            height: 100%;
            overflow-y: auto;
            .notFound {
                margin-top: rem(16px);
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-top: rem(80px);
                background: var(--contentColor);
                img {
                    width: rem(96px);
                    height: rem(96px);
                }
                .tips {
                    margin-top: rem(16px);
                    font-size: rem(24px);
                    font-weight: 500;
                }
                .btn {
                    margin-top: rem(16px);
                    width: rem(192px);
                    height: rem(64px);
                    border-radius: rem(8px);
                    background-color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--contentColor);
                    font-size: rem(24px);
                }
            }
        }
    }
}
</style>
