<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :menu='false' :title='tradeName' />
        <Loading :show='loading' />
        <van-tabs v-model:active='active' class='tabs'>
            <van-tab :title='$t("trade.curTrust")'>
                <div v-if='pendingList.length === 0'>
                    <van-empty :description='$t("common.noData")' image='/images/empty.png' />
                </div>
                <div v-else class='trust-wrap'>
                    <van-pull-refresh v-model='loading' @refresh='onRefresh'>
                        <trustItem
                            v-for='item in pendingList'
                            :key='item.id'
                            :product='item'
                            @click.stop='toDetail(item)'
                        />
                    </van-pull-refresh>
                </div>
            </van-tab>
            <van-tab :title='$t("trade.dealList")'>
                <div class='filter-wrap'>
                    <van-dropdown-menu :active-color='$style.primary' :overlay='true'>
                        <van-dropdown-item
                            v-model='directionVal'
                            :options='direction'
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
                        />
                        <van-dropdown-item
                            v-model='timeVal'
                            :options='timeList'
                        />
                    </van-dropdown-menu>
                </div>
                <div class='list-wrap'>
                    <!-- <div v-for='item in 20' :key='item' class='trust-item'>
                        <div class='t-header'>
                            <div class='fl'>
                                <span class='name'>
                                    欧元美元02
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
                    </div> -->
                </div>
            </van-tab>
        </van-tabs>
    </div>

    <!-- 侧边栏-切换产品 -->
    <sidebarProduct
        v-model='switchProductVisible'
        :default-trade-type='tradeType'
        @select='onSelectProduct'
    />
</template>

<script>
import sidebarProduct from '@plans/components/sidebarProduct.vue'
import trustItem from '@plans/modules/trust/trust.vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, ref, nextTick, reactive, toRefs, watch } from 'vue'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        trustItem,
        sidebarProduct
    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const loading = ref(false)
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { tradeType } = route.query

        const productDropdown = ref(null)

        const state = reactive({
            active: 0,
            loading: false,
            switchProductVisible: false,
            directionVal: 0,
            positionTypeVal: 0,
            timeVal: 0,
            productVal: 0,
            curProduct: {},
            direction: [
                { text: t('trade.direction'), value: 0 },
                { text: t('trade.buy'), value: 1 },
                { text: t('trade.sell'), value: 2 },
            ],
            positionType: [
                { text: t('trade.openClose'), value: 0 },
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
            ]

        })

        const tradeName = computed(() => store.state._base.plans.find(({ id }) => id === tradeType)?.name)

        // 获取挂单列表
        const pendingList = computed(() => store.state._trade.pendingList[tradeType] || [])

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const toDetail = (item) => {
            router.push({
                path: '/trustDetail',
                query: {
                    id: item.id,
                    symbolId: item.symbolId,
                    tradeType: route.query.tradeType,
                }
            })
        }

        const onRefresh = () => {
            queryPendingList()
        }

        watch(
            () => pendingList.value?.length,
            async (newval) => {
                await nextTick()
                if (!newval) return false
                const subscribList = pendingList.value.map(el => {
                    return {
                        symbolId: el.symbolId,
                        tradeType: el.tradeType
                    }
                })

                if (subscribList.length > 0) QuoteSocket.send_subscribe(subscribList)
            },
            { immediate: true }
        )

        const openProductSwitch = (val) => {
            productDropdown.value.toggle(false)
            state.switchProductVisible = true
        }

        const queryPendingList = () => {
            // 获取委托列表
            state.loading = true
            store.dispatch('_trade/queryPBOOrderPage', {
                customerNo: customInfo.value.customerNo,
                sortFieldName: 'orderTime',
                sortType: 'desc',
                tradeType: route.query.tradeType,
            }).then(res => {
                console.log('res res re sres ', res)
                state.loading = false
            })
        }

        // 产品选择品选择产品回调
        const onSelectProduct = (p) => {
            state.curProduct = p
            state.product[0].text = p.symbolName
            state.switchProductVisible = false
        }

        queryPendingList()

        return {
            toDetail,
            pendingList,
            loading,
            tradeName,
            onSelectProduct,
            openProductSwitch,
            onRefresh,
            tradeType,
            productDropdown,
            ...toRefs(state),

        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    height: 100%;
    padding-top: rem(95px);
    //padding-right: rem(20px);
    //padding-left: rem(20px);
    overflow: auto;
    background-color: var(--bgColor);
    .tabs {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        :deep(.van-tabs__wrap) {
            flex: 0 0 44px;
        }
        :deep(.van-tabs__content) {
            height: 100%;
            overflow-y: auto;
        }
        :deep(.van-tab__text) {
            font-size: rem(28px);
        }
        :deep(.van-tabs__line) {
            width: 50%;
            background-color: var(--primary);
        }
        .van-dropdown-menu__item {
            background-color: var(--contentColor);
        }
        .van-dropdown-menu {
            background-color: var(--contentColor);
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
    }
    .trust-item {
        margin-top: rem(20px);
    }
}
</style>
