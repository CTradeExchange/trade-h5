<template>
    <div class='layout'>
        <!-- 加载中组件 -->
        <Loading :show='loading' />
        <!-- 头部导航 -->

        <Top
            back
            left-icon='arrow-left'
            :right-action='rightAction'
            :show-center='true'
            @rightClick='rightClick'
        />
        <!-- 提币模块 -->
        <div v-if="['digit_wallet','coin_mdpay','otc365'].includes(currentTab)" class='wrap'>
            <WithdrawCoin :withdraw-method='currentTab' />
        </div>
        <!-- 提现模块 -->
        <div v-if="currentTab.includes('bank')" class='wrap'>
            <WithdrawMoney />
        </div>
    </div>
</template>

<script>
// vue
import { reactive, computed, onMounted, toRefs } from 'vue'
// router
import { useRoute, useRouter } from 'vue-router'
// vuex
import { useStore } from 'vuex'
// components
import Top from '@/components/top'
import WithdrawMoney from './withdraw-money'
import WithdrawCoin from './withdraw-coin'
// vant
import { Dialog } from 'vant'
// i18n
import { useI18n } from 'vue-i18n'
// api
import { getWithdrawMethodList } from '@/api/user'

export default {
    components: {
        Top,
        WithdrawMoney,
        WithdrawCoin
    },
    setup () {
        // router
        const router = useRouter()
        const route = useRoute()
        // vuex
        const store = useStore()
        // i18n
        const { t } = useI18n({ useScope: 'global' })
        // 账户信息
        const { value: customInfo } = computed(() => store.state._user.customerInfo)
        const account = computed(() => store.state._user.account)

        const { tab, accountId } = route.query

        const state = reactive({
            // 加载状态
            loading: false,
            // 导航栏选项卡
            tabs: [],
            // 当前导航栏选项卡
            currentTab: route.query.currentTab,
            // 导航栏右侧标题
            rightAction: {}
        })

        state.rightAction.title = t('withdraw.moneyRecordText')
        // state.rightAction.path = '/withdrawRecord'

        // 判断是显示提现记录还是提币记录
        if (['digit_wallet', 'coin_mdpay', 'otc365'].includes(state.currentTab)) {
            // state.rightAction.title = t('withdraw.coinRecordText')
            state.rightAction.path = '/withdrawRecord?withdrawType=2'
        } else {
            // state.rightAction.title = t('withdraw.moneyRecordText')
            state.rightAction.path = '/withdrawRecord?withdrawType=1'
        }

        // 导航栏右侧标题点击跳转
        const rightClick = () => {
            router.push(state.rightAction.path)
        }

        const init = () => {
            if (accountId) store.commit('_user/Update_account', accountId)
        }
        init()

        return {
            ...toRefs(state),
            rightClick

        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bgColor);
}
.wrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
}
.tabs {
    display: flex;
    justify-content: center;
    width: 60%;
    height: 100%;
    margin: 0 auto;
    font-size: rem(34px);
    .tabs-item {
        display: inline-flex;
        align-items: center;
        height: 100%;
        margin: 0 rem(40px);
        color: var(--minorColor);
        transition: all 0.1s;
    }
    .tabs-item-active {
        position: relative;
        color: var(--color);
        font-weight: bold;
        &::after {
            position: absolute;
            bottom: 0;
            left: 5%;
            width: 90%;
            height: rem(6px);
            background-color: var(--color);
            border-radius: rem(3px);
            content: '';
        }
    }
}
</style>
