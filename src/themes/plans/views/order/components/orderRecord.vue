<template>
    <div ref='moduleRef' class='bg-contentColor'>
        <div class='header-case'>
            <van-tabs v-model:active='current' class='tabs' @change='changeTab'>
                <van-tab v-for='item in tabList' :key='item.value' :name='item.value' :title='item.title'>
                    <template #title>
                        <span :id="item.value === 'pending' ? 'eighth-element-driver' : ''">
                            {{ item.title }}
                        </span>
                        <span v-if="item.value === 'position'">
                            ({{ positionList.length }})
                        </span>
                        <span v-if="item.value === 'pending'">
                            ({{ pendingList.length }})
                        </span>
                    </template>
                </van-tab>
            </van-tabs>
            <i v-if="current !== 'assets' && current !== 'position'" class='link icon_mingxi1' @click='goList'></i>
        </div>
        <!-- 当前订单、当前挂单 -->
        <div v-if="current === 'pending'">
            <noAssetsTips v-if='pendingList.length === 0' :description="$t('trade.noPendings')" />
            <div v-else class='trust-list'>
                <trustItem v-for='item in pendingList' :key='item.id' :product='item' />
            </div>
        </div>
        <!-- 成交记录 -->
        <div v-if="current === 'deal'">
            <div v-if='dealLoading' class='flex justify-center py-20 text-sm'>
                <van-loading color='var(--primary)'>
                    {{ $t('compLang.loading') }}
                </van-loading>
            </div>
            <noAssetsTips v-else-if='dealList.length === 0' :description="$t('withdraw.noRecords')" />
            <dealList v-else :biz-type-text='bizTypeText' :list='dealList' :trade-type='tradeType' />
        </div>
        <!-- 持仓 -->
        <positionList v-if="current === 'position'" :show-header='false' :show-trade-btn='false' />
        <!-- 资产 -->
        <div v-if="current === 'assets'" class='assets-list'>
            <!-- 资产搜索 -->
            <AssetFilter
                v-if='customerInfo'
                :hide-asset='hideAsset'
                :search-text='tradeSearchMap[tradeType]'
                @changeState='changeState'
                @searchAsset='searchAsset'
            />
            <noAssetsTips v-if='accountList.length === 0' :description="$t('trade.noAssets')" is-position />
            <assetsItem v-for='account in accountList' :key='account.accountId' class='block' :data='account' />
        </div>
    </div>
</template>

<script>
import trustItem from '@plans/modules/trust/trustItem.vue'
import assetsItem from '@plans/modules/assets/assetsItem.vue'
import dealList from '@plans/modules/deal/dealList.vue'
import AssetFilter from '@plans/components/assetFilter.vue'
import noAssetsTips from '@plans/components/noAssetsTips.vue'
import positionList from '@plans/modules/positionList/positionList.vue'
import { reactive, toRefs, watch, computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { tradeRecordList } from '@/api/user'
import { localGet } from '@/utils/util'
import mitt from '@/utils/mitt'
import useSubscribe24H from '@/hooks/product/useSubscribe24H.js'
export default {
    components: {
        trustItem,
        assetsItem,
        dealList,
        positionList,
        AssetFilter,
        noAssetsTips
    },
    props: {
        // 玩法类型
        tradeType: {
            type: [String, Number],
            default: '',
        },
    },
    emits: ['subscribe'],
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            // 选项卡列表
            tabList: [],
            // 当前选项卡
            current: '',
            // 账户id集合
            accountIds: [],
            // 成交记录列表数据
            dealList: [],
            dealLoading: false,
            // bizTypeText
            bizTypeText: {},
            // 需要订阅的产品symbolKey集合
            productKyes: [],
            hideAsset: JSON.parse(localGet('hideAsset')),
            searchText: '',
            tradeSearchMap: {},
        })
        const moduleRef = ref(null)

        // 账户列表
        const accountList = computed(() => {
            const accountList = store.state._user?.customerInfo?.accountList || []
            const list = accountList.filter((item) => Number(item.tradeType) === Number(props.tradeType))
            const searchText = state.tradeSearchMap[props.tradeType] || ''
            if (state.hideAsset) {
                if (Number(props.tradeType) === 3) {
                    return list.filter(
                        (item) =>
                            (item.balance > 0 || item.liabilitiesPrincipal > 0) &&
                            item.currency.toUpperCase().includes(searchText.toUpperCase()),
                    )
                } else if (Number(props.tradeType) === 5) {
                    return list.filter((item) => item.balance > 0 && item.currency.toUpperCase().includes(searchText.toUpperCase()))
                }
            }
            return list.filter((item) => item.currency.toUpperCase().includes(searchText.toUpperCase())) || []
        })

        const customerInfo = computed(() => store.state._user.customerInfo)
        // 当前订单、当前挂单数据
        const pendingList = computed(() => store.state._trade.pendingList[props.tradeType] || [])
        // 持仓列表数据
        const positionList = computed(() => store.state._trade.positionList[props.tradeType] || [])
        const symbolKeys = computed(() => pendingList.value.map((e) => `${e.symbolId}_${props.tradeType}`))
        useSubscribe24H(symbolKeys)

        // 监听玩法类型
        watch(
            () => props.tradeType,
            () => {
                // 设置当前玩法
                store.commit('_quote/Update_tradeType', props.tradeType)
                // 设置选项卡数据
                setTabList()
            },
            { immediate: true },
        )

        // 设置选项卡数据
        function setTabList () {
            let tabList = []
            const accountIds = []
            if ([1, 2].includes(Number(props.tradeType))) {
                tabList = [
                    { title: t('trade.position'), value: 'position' },
                    { title: t('trade.curTrust'), value: 'pending' },
                    { title: t('trade.dealList'), value: 'deal' },
                ]
            }
            if ([3, 5, 9].includes(Number(props.tradeType))) {
                tabList = [
                    { title: t('trade.curTrust'), value: 'pending' },
                    { title: t('trade.dealList'), value: 'deal' },
                    { title: t('trade.asset'), value: 'assets' },
                ]
            }
            accountList.value.map((el) => {
                accountIds.push(el.accountId)
            })
            state.current = tabList[0]?.value
            state.tabList = tabList
            state.accountIds = accountIds
            init()
        }

        // 切换选项卡
        const changeTab = () => {
            init()
        }

        // 跳转到列表页面
        const goList = () => {
            router.push({
                name: 'List',
                query: {
                    tradeType: props.tradeType,
                    active: state.current,
                },
            })
        }

        // 数据初始化
        function init () {
            switch (state.current) {
                case 'pending':
                    getOrderPage()
                    break
                case 'deal':
                    state.dealList = []
                    state.bizTypeText = {}
                    getDealRecord()
                    break
                case 'position':
                    getPositionList()
                    break
                case 'assets':
                    // 每次切换资产页面拉取用户信息
                    if (customerInfo.value) {
                        store.dispatch('_user/findCustomerInfo', false)
                        getAssetsInfo()
                    }
                    break
            }
        }

        onMounted(() => {
            // 收到市价成交消息时需同时更新持仓记录和当前订单标签页数据
            mitt.on('POSITION_OPEN', () => {
                if (state.current === 'pending') {
                    init()
                }
            })
        })

        onUnmounted(() => {
            mitt.off('POSITION_OPEN')
        })

        // 获取成交记录数据
        function getDealRecord () {
            if (!customerInfo.value) return
            const params = {
                current: 1,
                size: 10,
                executeStartTime: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf(),
                executeEndTime: window.dayjs(window.dayjs(new Date()).format('YYYY/MM/DD 23:59:59')).valueOf(),
                accountIds: state.accountIds.toString(),
                tradeType: Number(props.tradeType),
                sortFieldName: 'executeTime',
                sortType: 'desc',
            }
            state.dealLoading = true
            tradeRecordList(params).then((res) => {
                if (res.check() && res.data) {
                    state.dealList = res.data.list
                    state.bizTypeText = res.data.bizTypeText
                    state.productKyes = []
                    subscribe()
                }
            }).finally(() => {
                state.dealLoading = false
            })
        }

        // 获取资产数据
        function getAssetsInfo () {
            store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: props.tradeType }).then(() => {
                state.productKyes = []
                subscribe()
            })
        }

        // 获取当前持仓、当前挂单数据
        function getOrderPage () {
            store
                .dispatch('_trade/queryPBOOrderPage', {
                    tradeType: props.tradeType,
                    sortFieldName: 'orderTime',
                    sortType: 'desc',
                    accountIds: state.accountIds.toString(),
                })
                .then((res) => {
                    if (res.check()) {
                        const arr = []
                        if (res.data) {
                            res.data.map((elem) => {
                                arr.push(elem.symbolId + '_' + elem.tradeType)
                            })
                        }
                        state.productKyes = arr
                        subscribe()
                    }
                })
        }

        // 获取持仓列表数据
        function getPositionList () {
            store
                .dispatch('_trade/queryPositionPage', {
                    tradeType: props.tradeType,
                    sortFieldName: 'openTime',
                    sortType: 'desc',
                    accountId: state.accountIds.toString(),
                })
                .then((res) => {
                    if (res.check()) {
                        const arr = []
                        if (res.data) {
                            res.data.map((elem) => {
                                arr.push(elem.symbolId + '_' + elem.tradeType)
                            })
                        }
                        state.productKyes = arr
                        subscribe()
                    }
                })
        }

        // 通知父组件需要订阅的产品
        function subscribe () {
            emit('subscribe', state.productKyes)
        }

        // 隐藏0资产事件
        const changeState = (val) => {
            state.hideAsset = val
        }

        // 搜索资产
        const searchAsset = (val) => {
            state.tradeSearchMap[props.tradeType] = val
        }

        // 切换tab
        const handleActiveName = (type) => {
            if ([1, 2].includes(Number(props.tradeType))) {
                state.current = type
            }
            changeTab()
            // 自动滚动到当前tab
            document.querySelector('.container').scrollTop = moduleRef.value.offsetTop - 100
        }

        onMounted(() => {
            // 初始化监听方法
            mitt.on('OrderRecord', handleActiveName)
        })

        onUnmounted(() => {
            // 注销
            mitt.off('OrderRecord', handleActiveName)
        })

        return {
            ...toRefs(state),
            moduleRef,
            changeTab,
            goList,
            init,
            pendingList,
            accountList,
            searchAsset,
            changeState,
            customerInfo,
            positionList
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.header-case {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: rem(78px);
    padding: 0 16px;
    background: var(--contentColor);
    border-bottom: 1px solid var(--lineColor);
    .tabs {
        height: 100%;

        --van-tabs-bottom-bar-width: 11vw;
        --van-tabs-bottom-bar-color: var(--primary);
        :deep(.van-tabs__wrap) {
            height: 100%;
        }
        :deep(.van-tab) {
            flex: none;
            margin-right: rem(40px);
            padding: 0;
            text-align: center;
        }
        :deep(.van-tabs__nav) {
            background: none;
        }
    }
    .link {
        color: var(--normalColor);
        font-size: rem(34px);
        line-height: 1;
    }
}
.assets-list {
    padding: rem(20px);
    .block {
        margin-bottom: rem(20px);
        border-radius: 4px;
    }
}
</style>
