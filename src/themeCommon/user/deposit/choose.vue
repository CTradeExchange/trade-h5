<template>
    <div class='page-wrap'>
        <!-- 头部导航栏 -->
        <Top back show-center />
        <!-- 页面加载状态 -->
        <Loading :show='loading' />
        <!-- 页面内容 -->
        <div class='page-content'>
            <!-- 资产账户 -->
            <div class='asset-account'>
                <h3 class='title'>
                    {{ $t('deposit.assetAccount') }}
                </h3>
                <div class='list'>
                    <div v-for='(item, index) in accountList' :key='index' :class="['item', { 'active': activeIndex === index }]" @click='switchCurrency(index)'>
                        <div v-if='activeIndex === index' class='check'>
                            <van-icon color='#fff' name='success' />
                        </div>
                        <img :src="'/images/currency_icon/' + item.currency + '.png'" />
                        <div class='text'>
                            <span class='name'>
                                {{ item.currency }}
                            </span>
                            <span v-if='currencyConfig[item.currency]' class='alias'>
                                {{ currencyConfig[item.currency] }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 充值操作 -->
            <div class='recharge-handle'>
                <h3 class='title'>
                    {{ $t('deposit.rechargeWay') }}
                </h3>
                <div class='recharge-way'>
                    <div :class="['item', { 'active': way === 1, 'disable': disable || directDisable }]" @click='switchDirect'>
                        <div class='check'>
                            <van-icon color='#fff' name='success' />
                        </div>
                        <i class='icon icon_zhichong'></i>
                        <div class='text'>
                            <span class='name'>
                                {{ $t('deposit.direct') }}
                            </span>
                            <span class='des'>
                                {{ $t('deposit.directDes') }}
                            </span>
                        </div>
                    </div>
                    <div :class="['item', { 'active': way === 2, 'disable': disable || exchangeDisable }]" @click='switchExchange'>
                        <div class='check'>
                            <van-icon color='#fff' name='success' />
                        </div>
                        <i class='icon icon_huidui'></i>
                        <div class='text'>
                            <span class='name'>
                                {{ $t('deposit.exchange') }}
                            </span>
                            <span class='des'>
                                {{ $t('deposit.exchangeDes') }}
                            </span>
                        </div>
                    </div>
                </div>
                <div :class="['recharge-btn', { 'disable': disable }]" @click='goRecharge'>
                    <span>{{ $t('deposit.immediateRecharge') }}</span>
                    <van-icon class='arrow' name='arrow' />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Top from '@/components/top'
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { currencyConfig } from './config'
import { queryPayType } from '@/api/user'
import { localSet } from '@/utils/util'
import { Toast, Dialog } from 'vant'
export default {
    components: {
        Top
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            // 页面加载状态
            loading: false,
            // 玩法类型
            tradeType: route.query.tradeType,
            // 支付通道列表
            paymentTypes: [],
            // 当前选中币种索引
            activeIndex: '',
            // 当前选中币中账户
            accountInfo: {},
            // 当前选中充值方式 1.直充 2.汇兑
            way: '',
            // 是否禁用所有按钮
            disable: true,
            // 直充是否禁用
            directDisable: true,
            // 汇兑是否禁用
            exchangeDisable: true,
            // 当前直充支付通道
            paymentInfo: ''
        })
        // 客户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 账户列表
        const accountList = computed(() => customerInfo.value.accountList?.filter(el => Number(el.tradeType) === Number(state.tradeType)))

        // 获取支付通道
        const getPayTypes = () => {
            const accountInfo = state.accountInfo
            const params = {
                tradeType: state.tradeType,
                companyId: customerInfo.value.companyId,
                customerNo: customerInfo.value.customerNo,
                customerGroupId: customerInfo.value.customerGroupId,
                country: customerInfo.value.country,
                clientType: 'mobile',
                accountCurrency: accountInfo.currency,
                accountId: accountInfo.accountId
            }
            queryPayType(params).then(res => {
                if (res.check()) {
                    state.paymentTypes = res.data
                    filterPayment()
                } else {
                    state.paymentTypes = []
                    filterPayment()
                }
            })
        }

        // 过滤支付通道数据
        const filterPayment = () => {
            const paymentTypes = state.paymentTypes
            if (paymentTypes.length === 0) {
                state.disable = true
                state.way = ''
            } else {
                state.disable = false
                state.directDisable = true
                state.exchangeDisable = true
                paymentTypes.map(elem => {
                    // 直充
                    if (elem.rechargeType.indexOf('1') !== -1) {
                        state.directDisable = false
                        if (!state.paymentInfo) state.paymentInfo = elem
                    }
                    // 汇兑
                    if (elem.rechargeType.indexOf('2') !== -1) {
                        state.exchangeDisable = false
                    }
                })
                // 设置默认选中充值方式
                state.way = state.directDisable ? 2 : 1
            }
        }

        // 切换币种
        const switchCurrency = (index) => {
            if (state.activeIndex === index) {
                state.activeIndex = ''
                state.accountInfo = {}
            } else {
                state.activeIndex = index
                state.accountInfo = accountList.value[index]
                // 获取支付通道
                getPayTypes()
            }
        }

        // 充值方式切换为直充
        const switchDirect = () => {
            if (state.disable || state.directDisable) return
            state.way = 1
        }

        // 充值方式切换汇兑
        const switchExchange = () => {
            if (state.disable || state.exchangeDisable) return
            state.way = 2
        }

        // 跳转到充值页面
        const goRecharge = () => {
            switch (state.way) {
                // 跳转到直充页面
                case 1:
                    localSet('paymentInfo', JSON.stringify(state.paymentInfo))
                    router.push({
                        path: '/depositDirect',
                        query: {
                            currency: state.accountInfo.currency,
                            paymentCode: state.paymentInfo.paymentCode
                        }
                    })
                    break
                // 跳转到汇兑页面
                case 2:
                    router.push({
                        path: '/deposit',
                        query: {
                            tradeType: state.tradeType,
                            currency: state.accountInfo.currency,
                            accountId: state.accountInfo.accountId
                        }
                    })
                    break
            }
        }

        return {
            ...toRefs(state),
            accountList,
            currencyConfig,
            switchCurrency,
            switchDirect,
            switchExchange,
            goRecharge
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.page-content {
    flex: 1;
    overflow-y: auto;
}
// 资产账户
.asset-account {
    padding: 0 rem(30px);
    margin-top: rem(30px);
    .title {
        line-height: 1;
        margin-bottom: rem(32px);
        font-size: rem(48px);
        font-weight: normal;
        color: var(--color);
    }
    .list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item {
            display: flex;
            align-items: center;
            width: rem(330px);
            height: rem(110px);
            margin-bottom: rem(30px);
            padding-left: rem(30px);
            background: var(--contentColor);
            border: 1px solid transparent;
            border-radius: rem(10px);
            img {
                width: rem(48px);
                height: rem(48px);
                margin-right: rem(20px);
                background: var(--assistColor);
                border-radius: 50%;
            }
            .text {
                display: flex;
                flex-direction: column;
                .name {
                    font-size: rem(32px);
                    color: var(--color);
                }
                .alias {
                    margin-top: rem(4px);
                    font-size: rem(24px);
                    color: var(--minorColor);
                }
            }
        }
        .active {
            background: rgba(71, 127, 210, 0.1);
            border: 1px solid var(--primary);
            position: relative;
            .check {
                display: flex;
                justify-content: center;
                align-items: center;
                width: rem(30px);
                height: rem(30px);
                background: var(--primary);
                border-radius: 0 rem(10px) 0 rem(10px);
                position: absolute;
                top: -1px;
                right: -1px;
                &:deep(.van-icon) {
                    margin-top: rem(-5px);
                }
            }
        }
    }
}
// 充值操作
.recharge-handle {
    margin-top: rem(80px);
    padding: 0 rem(30px);
    .title {
        line-height: 1;
        margin-bottom: rem(32px);
        font-size: rem(48px);
        font-weight: normal;
        color: var(--color);
    }
    .recharge-way {
        .item {
            display: flex;
            align-items: center;
            height: rem(130px);
            margin-bottom: rem(30px);
            padding: 0 rem(36px);
            background: var(--contentColor);
            border: 1px solid transparent;
            border-radius: rem(10px);
            position: relative;
            &:last-of-type {
                margin-bottom: 0;
            }
            .check {
                display: none;
            }
            .icon {
                margin-right: rem(36px);
                font-size: rem(40px);
                color: var(--color);
            }
            .text {
                display: flex;
                flex-direction: column;
                .name {
                    font-size: rem(32px);
                    color: var(--color);
                }
                .des {
                    margin-top: rem(4px);
                    font-size: rem(24px);
                    color: var(--minorColor);
                }
            }
        }
        .active {
            background: rgba(71, 127, 210, 0.1);
            border: 1px solid var(--primary);
            .check {
                display: flex;
                justify-content: center;
                align-items: center;
                width: rem(30px);
                height: rem(30px);
                background: var(--primary);
                border-radius: 0 rem(10px) 0 rem(10px);
                position: absolute;
                top: -1px;
                right: -1px;
                &:deep(.van-icon) {
                    margin-top: rem(-5px);
                }
            }
        }
        .disable {
            background: var(--lineColor);
            opacity: .5;
        }
    }
    .recharge-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        height: rem(80px);
        margin-top: rem(40px);
        margin-bottom: rem(30px);
        background: var(--primary);
        border-radius: rem(6px);
        span {
            margin-right: rem(10px);
            font-size: rem(30px);
            color: #fff;
        }
        .arrow {
            margin-top: rem(-6px);
            font-size: rem(30px);
            color: #fff;
        }
        &.disable {
            opacity: .5;
        }
    }
}
</style>
