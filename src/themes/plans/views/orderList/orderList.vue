<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :menu='false' :title='tradeName' />
        <!-- <Loading :show='loading' /> -->
        <van-tabs v-model:active='active' class='tabs'>
            <van-tab :title='$t("trade.curTrust")'>
                <div v-if='pendingList.length === 0'>
                    <van-empty :description='$t("common.noData")' image='/images/empty.png' />
                </div>
                <div v-else class='trust-wrap'>
                    <van-pull-refresh v-model='loading' @refresh='onRefresh'>
                        <trustItem v-for='item in pendingList' :key='item.id' :product='item' @click.stop='toDetail(item)' />
                    </van-pull-refresh>
                </div>
            </van-tab>
            <van-tab :title='$t("trade.dealList")'>
                <div class='order-wrap'>
                    <van-dropdown-menu :overlay='true'>
                        <van-dropdown-item v-model='directionVal' :options='direction' />
                        <van-dropdown-item v-model='productVal' :options='product' @open='open' />
                        <van-dropdown-item v-model='positionTypeVal' :options='positionType' />
                        <van-dropdown-item v-model='timeVal' :options='timeList' />
                    </van-dropdown-menu>
                </div>
            </van-tab>
        </van-tabs>
    </div>

    <!-- 侧边栏-切换产品 -->
    <sidebarProduct v-model='switchProductVisible' @select='onSelectProduct' />
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

        const state = reactive({
            loading: false,
            directionVal: 0,
            positionTypeVal: 0,
            timeVal: 0,
            productVal: 0,
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
            console.log('刷新')
            loading = false
            queryPBOOrderPage()
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

        const open = (val) => {
            debugger
        }

        const queryPBOOrderPage = () => {
            // 获取委托列表
            store.dispatch('_trade/queryPBOOrderPage', {
                customerNo: customInfo.value.customerNo,
                sortFieldName: 'orderTime',
                sortType: 'desc',
                tradeType: route.query.tradeType,
            })
        }

        queryPBOOrderPage()

        return {
            toDetail,
            pendingList,
            loading,
            tradeName,
            open,
            onRefresh,
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
    }
    .trust-item {
        margin-top: rem(20px);
    }
}
</style>
