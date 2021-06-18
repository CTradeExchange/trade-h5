<template>
    <div class='layout'>
        <!-- 加载中组件 -->
        <Loading :show='loading' />
        <!-- 头部导航 -->
        <Top
            back
            left-icon='arrow-left'
            :right-action='rightAction'
            @rightClick='rightClick'
        >
            <template #tabs>
                <div class='tabs'>
                    <div
                        v-for='item in tabs'
                        :key='item.key'
                        :class="{ 'tabs-item': true, 'tabs-item-active': item.key === currentTab }"
                        @click='switchTabs(item.key)'
                    >
                        <span>{{ item.title }}</span>
                    </div>
                </div>
            </template>
        </Top>
        <!-- 提币模块 -->
        <div v-if="currentTab === 'coin'" class='wrap'>
            <WithdrawCoin />
        </div>
        <!-- 提现模块 -->
        <div v-if="currentTab === 'money'" class='wrap'>
            <WithdrawMoney />
        </div>
    </div>
</template>

<script>
// vue
import { reactive, computed, onMounted, toRefs } from 'vue'
// router
import { useRouter } from 'vue-router'
// vuex
import { useStore } from 'vuex'
// components
import Top from '@/components/top'
import WithdrawMoney from './components/withdraw-money'
import WithdrawCoin from './components/withdraw-coin'
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
        // vuex
        const store = useStore()
        // i18n
        const { t } = useI18n({ useScope: 'global' })
        // 账户信息
        const { value: customInfo } = computed(() => store.state._user.customerInfo)

        const state = reactive({
            // 加载状态
            loading: false,
            // 导航栏选项卡
            tabs: [],
            // 当前导航栏选项卡
            currentTab: '',
            // 导航栏右侧标题
            rightAction: {}
        })

        // 切换导航栏选项卡
        const switchTabs = (key) => {
            if (key === state.currentTab) return
            state.currentTab = key
            switch (key) {
                case 'coin':
                    state.rightAction.title = t('withdraw.coinRecordText')
                    state.rightAction.path = '/coinRecord'
                    break
                case 'money':
                    state.rightAction.title = t('withdraw.moneyRecordText')
                    state.rightAction.path = '/withdrawRecord'
                    break
            }
        }
        // 导航栏右侧标题点击跳转
        const rightClick = () => {
            router.push(state.rightAction.path)
        }

        // 获取客户提现方式
        const getWithdrawWay = () => {
            state.loading = true
            getWithdrawMethodList({
                companyId: customInfo.companyId,
                customerGroupId: customInfo.customerGroupId,
                country: customInfo.country
            }).then(res => {
                state.loading = false
                const { data } = res
                if (!data || data.length === 0) {
                    return Dialog.alert({
                        title: t('withdraw.hint'),
                        theme: 'round-button',
                        confirmButtonText: t('withdraw.confirm'),
                        message: t('withdraw.wayMsg'),
                    }).then(() => {
                        router.go(-1)
                    })
                } else {
                    // 设置默认显示提款方式
                    const wayArr = data.map(elem => elem.withdrawMethod)
                    const isWithdrawCoin = wayArr.some(name => name === 'digit_wallet')
                    const isWithdrawMoney = wayArr.some(name => name === 'bank')
                    // 显示提币功能
                    if (isWithdrawCoin) {
                        state.tabs.push({ title: t('withdraw.coinTitle'), key: 'coin' })
                        state.rightAction.title = t('withdraw.coinRecordText')
                        state.rightAction.path = '/coinRecord'
                        state.currentTab = 'coin'
                    }
                    // 显示提现功能
                    if (isWithdrawMoney) {
                        state.tabs.push({ title: t('withdraw.moneyTitle'), key: 'money' })
                    }
                    // 当前显示为提现
                    if (!isWithdrawCoin && isWithdrawMoney) {
                        state.rightAction.title = t('withdraw.moneyRecordText')
                        state.rightAction.path = '/withdrawRecord'
                        state.currentTab = 'money'
                    }
                }
            })
        }

        onMounted(() => {
            // 获取用户提现方式
            getWithdrawWay()
        })

        return {
            ...toRefs(state),
            switchTabs,
            rightClick,
            getWithdrawWay
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
        color: var(--mutedColor);
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
