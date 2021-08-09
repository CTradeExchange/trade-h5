<template>
    <div v-if='showTabs' class='stallsAndDeal'>
        <van-tabs
            ref='tabs'
            class='tabs'
            color='#477fd3'
            line-height='2'
            line-width='33.3%'
            title-active-color='#477fd3'
        >
            <van-tab name='stalls' :title='$t("trade.handicap")'>
                <!-- 盘口报价 -->
                <Handicap
                    :show-pending='showPending'
                    :symbol-id='symbolId'
                />
            </van-tab>
            <van-tab v-if='statusList.indexOf("deal") > -1' name='deal' :title='$t("trade.deal")'>
                <!-- 实时成交记录 -->
                <DealList />
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import Handicap from '@plans/modules/handicap/index'
import DealList from '@plans/modules/realTimeDealList/index'

import { computed, reactive, toRefs, watch, onBeforeUnmount, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

export default {
    components: { Handicap, DealList },
    props: ['symbolId', 'settingList', 'curPrice'],
    setup (props) {
        const router = useRouter()
        const store = useStore()
        const state = reactive({
            statusList: props.settingList,
            isDealDelaying: false,
            timer: 0,

        })

        // 当前产品id 的挂单列表
        const pendingList = computed(() => store.state._trade.pendingList.filter(item => Number(item.symbolId) === Number(props.symbolId)))

        // 获取玩法id
        const tradeType = computed(() => store.state._base.tradeType)

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        // 是否显示挂单数量
        const showPending = computed(() => {
            return true
        })

        // 是否显示底部 tabs
        const showTabs = computed(() => {
            if (props.settingList.indexOf('stalls') === -1 && props.settingList.indexOf('deal') === -1) {
                return false
            }
            return true
        })

        // 跳转委托详情页面
        const toDetail = (item) => {
            router.push({
                path: '/trustDetail',
                query: {
                    id: item.id,
                    symbolId: item.symbolId
                }
            })
        }

        watch(
            () => props.settingList,
            (val) => {
                console.log(props.settingList)
                if (props.settingList.indexOf('stalls') === -1 && props.settingList.indexOf('deal') === -1) {
                    state.showTabs = false
                } else {
                    state.showTabs = true
                }
                state.statusList = props.settingList
                // state.activeObj = props.status
            })

        // 格式化时间
        const formatTime = (val) => {
            return dayjs(Number(val)).format('HH:mm:ss')
        }

        // 获取委托列表
        store.dispatch('_trade/queryPBOOrderPage', {
            tradeType: tradeType.value,
            customerNo: customInfo.value.customerNo,
            sortFieldName: 'orderTime',
            sortType: 'desc'
        })

        return {
            formatTime,
            showTabs,
            tradeType,
            customInfo,
            pendingList,
            toDetail,
            showPending,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.stallsAndDeal {
    min-width: rem(200px);
    height: rem(890px);
    margin-top: rem(10px);
    margin-bottom: rem(30px);
    background: var(--contentColor);
    .tabs {
        display: flex;
        flex-direction: column;
        height: 100%;
        :deep() {
            .van-tab {
                font-size: rem(24px);
                line-height: rem(50px);
                background-color: var(--contentColor);
            }
            .van-tabs__wrap {
                height: rem(80px);
                border-bottom: solid 1px var(--lineColor);
                .van-tab__text {
                    font-weight: bold;
                    font-size: rem(28px);
                }
            }
            .van-tabs__content {
                flex: 1;
                box-sizing: border-box;
                padding-top: rem(10px);
                padding-bottom: rem(20px);
                background: var(--contentColor);
                .van-tab__pane {
                    height: 100%;
                }
            }
        }
    }
    .trust-wrap {
        text-align: center;
        .to-all {
            color: var(--primary);
            line-height: rem(75px);
        }
    }
}
</style>
