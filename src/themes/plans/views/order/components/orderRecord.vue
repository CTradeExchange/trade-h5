<template>
    <div class='module-content'>
        <div class='header-case'>
            <van-tabs v-model:active='current' class='tabs' @change='changeTab'>
                <van-tab
                    v-for='item in tabList'
                    :key='item.value'
                    :name='item.value'
                    :title='item.title'
                />
            </van-tabs>
            <i v-if="current !== 'assets' && current !== 'position'" class='link icon_mingxi1' @click='goList'></i>
        </div>
        <!-- 当前委托、当前挂单 -->
        <div v-if="current === 'pending'">
            <van-empty
                v-if='pendingList.length === 0'
                :description="$t('trade.pendingEmpty')"
                image='/images/empty.png'
            />
            <div v-else class='trust-list'>
                <trustItem v-for='item in pendingList' :key='item.id' :product='item' />
            </div>
        </div>
        <!-- 成交记录 -->
        <div v-if="current === 'deal'">
            <van-empty v-if='dealList.length === 0' :description='$t("trade.noDealData")' image='/images/empty.png' />
            <dealList v-else :biz-type-text='bizTypeText' :list='dealList' :trade-type='tradeType' />
        </div>
        <!-- 持仓 -->
        <positionList v-if="current === 'position'" :show-header='false' />
        <!-- 资产 -->
        <div v-if="current === 'assets'" class='assets-list'>
            <assetsItem v-for='account in accountList' :key='account.accountId' class='block' :data='account' />
        </div>
    </div>
</template>

<script>
import trustItem from '@plans/modules/trust/trustItem.vue'
import assetsItem from '@plans/modules/assets/assetsItem.vue'
import dealList from '@plans/modules/deal/dealList.vue'
import positionList from '@plans/modules/positionList/positionList.vue'
import { reactive, toRefs, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { tradeRecordList } from '@/api/user'

export default {
    components: {
        trustItem,
        assetsItem,
        dealList,
        positionList
    },
    props: {
        // 玩法类型
        tradeType: {
            type: [String, Number],
            default: ''
        }
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
            // bizTypeText
            bizTypeText: {},
            // 需要订阅的产品symbolKey集合
            productKyes: []
        })

        // 账户列表
        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(props.tradeType)))
        // 当前委托、当前挂单数据
        const pendingList = computed(() => store.state._trade.pendingList[props.tradeType] || [])

        // 监听玩法类型
        watch(() => props.tradeType, () => {
            // 设置当前玩法
            store.commit('_quote/Update_tradeType', props.tradeType)
            // 设置选项卡数据
            setTabList()
        }, { immediate: true })

        // 设置选项卡数据
        function setTabList () {
            let tabList = []
            const accountIds = []
            if ([1, 2].includes(Number(props.tradeType))) {
                tabList = [
                    { title: t('trade.curPending'), value: 'pending' },
                    { title: t('trade.dealList'), value: 'deal' },
                    { title: t('trade.position'), value: 'position' }
                ]
            }
            if ([3, 5, 9].includes(Number(props.tradeType))) {
                tabList = [
                    { title: t('trade.curTrust'), value: 'pending' },
                    { title: t('trade.dealList'), value: 'deal' },
                    { title: t('trade.asset'), value: 'assets' }
                ]
            }
            accountList.value.map(el => {
                accountIds.push(el.accountId)
            })
            state.current = tabList[0].value
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
                    active: state.current
                }
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
                    getAssetsInfo()
                    break
            }
        }

        // 获取成交记录数据
        function getDealRecord () {
            const params = {
                current: 1,
                size: 10,
                executeEndTime: window.dayjs(window.dayjs(new Date()).format('YYYY/MM/DD 23:59:59')).valueOf(),
                accountIds: state.accountIds.toString(),
                tradeType: Number(props.tradeType),
                sortFieldName: 'executeTime',
                sortType: 'desc'
            }
            tradeRecordList(params).then(res => {
                if (res.check() && res.data) {
                    state.dealList = res.data.list
                    state.bizTypeText = res.data.bizTypeText
                    state.productKyes = []
                    subscribe()
                }
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
            store.dispatch('_trade/queryPBOOrderPage', {
                tradeType: props.tradeType,
                sortFieldName: 'orderTime',
                sortType: 'desc',
                accountIds: state.accountIds.toString()
            }).then(res => {
                if (res.check()) {
                    const arr = []
                    if (res.data) {
                        res.data.map(elem => {
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
            store.dispatch('_trade/queryPositionPage', {
                tradeType: props.tradeType,
                sortFieldName: 'openTime',
                sortType: 'desc',
                accountId: state.accountIds.toString()
            }).then(res => {
                if (res.check()) {
                    const arr = []
                    if (res.data) {
                        res.data.map(elem => {
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

        return {
            ...toRefs(state),
            changeTab,
            goList,
            init,
            pendingList,
            accountList
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.header-case {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: rem(78px);
    padding: 0 rem(30px);
    background: var(--contentColor);
    border-bottom: rem(1px) solid var(--lineColor);
    position: sticky;
    top: -1px;
    z-index: 100;
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
        line-height: 1;
        font-size: rem(34px);
        color: var(--normalColor);
    }
}
.assets-list {
    padding: 0 rem(20px);
    margin-top: rem(20px);
    .block {
        margin-bottom: rem(20px);
        border-radius: 4px;
    }
}
</style>
