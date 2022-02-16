<template>
    <div class='page-wrap'>
        <router-view />
        <div class='content-top' :style="'height: '+ contentHeight">
            <div class='quote-wrap'>
                <!-- 产品列表/搜索 -->
                <productSearch />
            </div>
            <div class='middle-wrap'>
                <div class='chart-content'>
                    <!-- 图表 -->
                    <chart />
                </div>
                <div class='trade-content' :style="'height: '+ tradeContentHeight">
                    <!-- 交易下单 -->
                    <trade />
                </div>
            </div>
            <div v-if='dealModeShowMap[product?.dealMode]?.handicap && product?.symbolName' class='right-wrap'>
                <!-- 选项卡 -->
                <el-tabs v-if='product.etf' v-model='activeName'>
                    <el-tab-pane :label="$t('trade.offer')" name='offer' />
                    <el-tab-pane :label="$t('trade.material')" name='material' />
                </el-tabs>
                <!-- 指数产品 -->
                <div v-if='product.isIndex' class='case'>
                    <div class='index-module'>
                        <realtimeInvestCompose :key='product?.symbolId' :symbol-id='symbolId' :title="$t('fundInfo.indexSample')" />
                    </div>
                </div>
                <!-- 非指数产品 -->
                <div v-else class='case'>
                    <!-- 报价 -->
                    <div v-if="activeName === 'offer'">
                        <!-- 盘口报价 -->
                        <div class='handicap-content'>
                            <handicap />
                        </div>
                        <!-- 实时成交记录 -->
                        <div class='deal-content'>
                            <dealList :symbol-id='product?.symbolId' />
                        </div>
                    </div>
                    <!-- 资料 -->
                    <div v-if="activeName === 'material'">
                        <fundInformation :fund-id='product.fundId' />
                    </div>
                </div>
            </div>
        </div>
        <div class='orders-wrap'>
            <!-- 委托/记录/资产 -->
            <userRecord />
        </div>
        <van-sticky class='assetsSticky' :offset-bottom='0' position='bottom'>
            <!-- 资产 -->
            <assetsModule />
        </van-sticky>
    </div>
</template>

<script>
import { reactive, toRefs, watch, computed, onBeforeUnmount, defineAsyncComponent, provide } from 'vue'
import chart from './pages/chart.vue'
import { useRouter, useRoute } from 'vue-router'
import handicap from './pages/handicap.vue'
import dealList from './pages/dealList.vue'
import trade from './pages/trade.vue'
import productSearch from './pages/productSearch'
import assetsModule from './pages/assets.vue'
import LoadingComponent from '@/components/loadingComponent'
import { isEmpty } from '@/utils/util'
import { useStore } from 'vuex'
import { toolHooks } from '@planspc/hooks/handicap'
import userRecord from './pages/userRecord'
import realtimeInvestCompose from '@planspc/components/fundInformation/realtimeInvestCompose.vue'
import { MsgSocket, QuoteSocket } from '@/plugins/socket/socket'

export default {
    components: {
        chart,
        handicap,
        dealList,
        trade,
        productSearch,
        assetsModule,
        userRecord,
        realtimeInvestCompose,
        fundInformation: defineAsyncComponent({
            loader: () => import('@planspc/components/fundInformation'),
            loadingComponent: LoadingComponent,
            delay: 0, // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
            suspensible: false
        })
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { dealModeShowMap } = toolHooks()
        const { tradeType, symbolId } = route.query
        store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const product = computed(() => store.getters.productActived)
        const state = reactive({
            // 当前选中选项卡 offer:报价 material:资料
            activeName: 'offer',
            symbolId
        })
        if (isEmpty(product.value)) {
            router.push('/')
        }
        // 获取产品详情
        store.dispatch('_quote/querySymbolInfo', { 'symbolId': product.value.symbolId, 'tradeType': product.value.tradeType })

        const tradeContentHeight = computed(() => {
            if (Number(product.value?.tradeType) === 5) {
                return '265px'
            } else if (Number(product.value?.tradeType) === 3) {
                return '340px'
            } else {
                return '430px'
            }
        })

        const contentHeight = computed(() => {
            if (Number(product.value?.tradeType) === 3) {
                return '785px'
            } else if (Number(product.value?.tradeType) === 5) {
                return '710px'
            } else {
                return '874px'
            }
        })

        watch(
            () => product.value?.tradeType,
            (newval, oldval) => {
                if (!isEmpty(customerInfo.value) && parseInt(newval) !== parseInt(oldval)) {
                    // 订阅资产数据
                    MsgSocket.subscribedListAdd(function () {
                        MsgSocket.subscribeAsset(product.value?.tradeType)
                    })
                    if ([3, 5, 9].includes(parseInt(newval))) {
                        store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: parseInt(newval) })
                    }
                }
            },
            { immediate: true }
        )

        // 监听产品symbolId
        watch(() => product.value?.symbolId, () => {
            // 设置默认选项卡
            state.activeName = 'offer'
            // 设置symbolId
            state.symbolId = product.value?.symbolId
        })

        onBeforeUnmount(() => {
            // 取消订阅
            QuoteSocket.cancel_subscribe()
            MsgSocket.cancelSubscribeAsset()
        })

        return {
            product,
            tradeType,
            tradeContentHeight,
            contentHeight,
            dealModeShowMap,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";

.page-wrap {
    font-size: 14px;
    padding:  8px;
    background: var(--bgColor);

    .content-top {
        max-height: 874px;
        display: flex;
        justify-content: space-between;

        >div {
            margin-right: 8px;
            border-radius: 10px;
            background: var(--contentColor);
            &:last-child{
                margin-right: 0;
            }
        }

        .quote-wrap {
            width: 360px;
            // height: 709px;
            display: flex;
            flex-direction: row;
        }

        .middle-wrap {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: var(--bgColor);
            >div{
                 border-radius: 10px;
                 background: var(--contentColor);
            }
            .chart-content{
                margin-bottom: 8px;
                height: 436px;
                overflow: hidden;

            }
            .trade-content{
                position: relative;
                padding: 5px 16px 20px 16px;
            }
        }

        .right-wrap {
            display: flex;
            flex-direction: column;
            width: 360px;
            &:deep {
                .el-tabs {
                    padding: 0 20px;
                    height: 40px;
                }
                .el-tabs__header {
                    margin: 0;
                }
                .el-tabs__nav {
                    display: flex;
                    width: 100%;
                    height: 40px;
                }
                .el-tabs__nav-wrap::after {
                    display: none;
                }
                .el-tabs__active-bar {
                    height: 2px;
                }
                .el-tabs__item {
                    flex: 1;
                    font-size: 14px;
                    color: var(--normalColor);
                    height: 40px;
                    text-align: center;
                    line-height: 40px;
                    &.is-active {
                        color: var(--primary);
                    }
                }
                .el-tabs__active-bar {
                    background-color: var(--primary);
                }
            }
            .case {
                flex: 1;
                overflow-y: auto;
                .index-module {
                    margin: rem(30px) rem(20px);
                }
            }
            .handicap-content{
                border-radius: 10px;
                background: var(--contentColor);
                padding: 10px 0 8px 16px;
                height: 368px;
            }
            .deal-content{
                border-radius: 10px;
                background: var(--contentColor);
                padding: 10px 16px 10px 16px;
                flex: 1;
                margin-top: 8px;
            }
        }
    }
    .orders-wrap{
        margin-top: 8px;
        height: 398px;
        background: var(--contentColor);
    }
    .assetsSticky{
        :deep(.van-sticky--fixed){
            box-shadow: 0 0 10px rgba(0,0,0,.15);
            background-color: var(--bgColor);
        }
    }
}
</style>
